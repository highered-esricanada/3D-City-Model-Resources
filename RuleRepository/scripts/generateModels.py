import csv
from scripting import *
import os

# Get a CityEngine instance
ce = CE()
ruleDict = {}

from os import listdir 
from os.path import isfile, join 


reader = csv.DictReader(open(ce.toFSPath("scripts/rule.csv")), delimiter=',')
#plane = ce.getObjectsFrom(ce.scene, ce.withName("'plane'"))[0]
for row in reader:    
    ruleDict[row['Name']] = row['Graph']
    

mypath = ce.toFSPath("rules")
files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
i = 0
for file in files:
    ruleNoExtension = file.replace(".cga", "").replace(".rpk", "")
    if ruleNoExtension in ruleDict:
        ruleNoExtension = file.replace(".cga", "").replace(".rpk", "")
        if ruleDict[ruleNoExtension] == "N":
            shapeLayer = ce.addShapeLayer(ruleNoExtension)
            vertices = [0 + i, 0, 0, 0 + i, 0, 20, 30 + i, 0, 20, 30 + i, 0, 0]
            shape = ce.createShape(shapeLayer, vertices)
        else:
            shapeLayer = ce.addGraphLayer(ruleNoExtension)
            vertices = [0 + i, 0, 0, 45 + i, 0, 0] #, 45+i, 0, -45]
            shape = ce.createGraphSegments(shapeLayer, vertices)
        ce.setRuleFile(shape, file)
        info = ce.getRuleFileInfo(file)
        rules = info['rules']
        for rule in rules:
            for annotation in rule['annotations']:
                print(annotation)
                if "@StartRule" in annotation:
                    defaultRule = rule['name'].replace("Default$", "")
                    ce.setStartRule(shape, defaultRule)
        i = i + 60
