'''
Created on Apr 19, 2021

@author: mluubert
'''
from scripting import *
import os
from os.path import join 
import math
# Get a CityEngine instance
ce = CE()

rootPath = "assets/StaticModels/"


def get_all_filepaths(root_path):
    all_files = []
    for root, dirs, files in os.walk(root_path):
        for filename in files:
            if filename.lower().endswith("glb"):
                all_files.append(os.path.join(root, filename))
    return all_files


mypath = ce.toFSPath(rootPath)
allfiles = get_all_filepaths(mypath)
i = 0

numFiles = len(allfiles)
width = int(math.ceil(math.sqrt(numFiles)))
i = 0
offsetSize = 30

authors = os.listdir(mypath)

for author in authors:
    mypath = ce.toFSPath(rootPath + author)
    files = get_all_filepaths(mypath)
    #layer = ce.addStaticModelLayer(author)
    for file in files:
        category = os.path.basename(os.path.dirname(file))
        name = os.path.basename(file).split(".")[0]
        offset =[(i%width)*offsetSize,0,(i/width)*offsetSize]
        path = "/ResourceLibrary/" + rootPath + "/" + author + "/" + category + "/"  + name + ".glb"
        print ("creating " + path + " at " + str(offset[0]) +" " + str(offset[2]) )
        layer = ce.addStaticModelLayer(author + " - " + category + " - " + name)
        staticModel = ce.createStaticModel(layer, offset, path)
        i+= 1