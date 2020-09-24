'''
Created on Apr 26, 2017

@author: mluubert
'''
from scripting import *
import os
import csv

# Get a CityEngine instance
ce = CE()
 
def export(objects, layerName):
    dir = ce.toFSPath("models/")
    settings = CEWebSceneExportModelSettings()
    settings.setBaseName(layerName)
    settings.setOutputPath(dir)
    ce.export(objects, settings) 
    
def createRulePackage(layerName):
    dir = ce.toFSPath("models/" + layerName + ".rpk")
    settings = RPKExportSettings()
    settings.setRuleFile("rules/" + layerName + ".cga")
    settings.setFile(dir)
    settings.addFilesAutomatically()
    ce.exportRPK(settings) 
   
def processSceneElements(rootGroup):
  layers = []
  setVisibility(rootGroup, False)       
  reader = csv.DictReader(open(ce.toFSPath("scripts/rule.csv")), delimiter=',')
  #plane = ce.getObjectsFrom(ce.scene, ce.withName("'plane'"))[0]
  for row in reader:    
    print row['Name']
    layer = ce.getObjectsFrom(ce.scene, ce.withName("'" + row['Name'] + "'"))[0]
    child = ce.getObjectsFrom(layer)[0]
    ce.setLayerPreferences(layer, "Visible", True)
    #ce.setLayerPreferences(plane, "Visible", False)
    shapes = ce.getObjectsFrom(ce.scene, ce.withName("'" + str(layer) + "'"))
    views = ce.getObjectsFrom(ce.get3DViews()) 
    views[0].frame()
    ce.waitForUIIdle()
    views[0].snapshot(ce.toFSPath('images')+ "\\"  + str(layer) + ".png", 270, 150)
    ce.setSelection(shapes)
    export(ce.selection(), str(layer))
    if (row['RPK'] == "Y" ):
      createRulePackage(str(layer))
    writeMD(row)
    ce.setLayerPreferences(layer, "Visible", False)
  setVisibility(rootGroup, True)

def setVisibility(rootGroup, visible):
  for child in rootGroup.getChildren(None):
    if ce.isLayer(child) and str(child) != "Scene Light" and str(child) != "Panorama":
      ce.setLayerPreferences(child, "Visible", visible)

def writeMD(row):
    content = "---\nlayout: rules\ncategory: rule" 
    properties = ["Name", "Type", "Alias", "Attribution", "Code", "Video", "RPK", "Description"]
    for property in properties:
        content += "\n"  + property + ": " + str(row[property])
    content += "\n---"
    fileName = "\\".join(os.path.dirname(__file__).split("\\")[:-2])
    f = open(fileName + "\\_rules\\" + str(row['Name']) + ".md", 'w')
    f.write(content)
    f.close()

if __name__ == '__main__':
    hierarchyRoot = ce.getSceneHierarchy()
    processSceneElements(hierarchyRoot)
    pass



