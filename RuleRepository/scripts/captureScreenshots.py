'''
Created on Apr 20, 2021

@author: mluubert
'''

from scripting import *
import os
import glob
ce = CE()

def setVisibility(rootGroup, visible):
  layers = []
  for child in rootGroup.getChildren(None):
    if ce.isLayer(child) and str(child) != "Scene Light" and str(child) != "Panorama" and str(child) != "Guides":
      ce.setLayerPreferences(child, "Visible", visible)
      layers.append(child)
  return layers



def createScreenshots():     
    shapes = ce.getObjectsFrom(ce.scene, ce.isShape)
    hierarchyRoot = ce.getSceneHierarchy()
    layers = setVisibility(hierarchyRoot, False)
    
    for layer in layers:
        #print("- " + layer)
        ce.setLayerPreferences(layer, "Visible", True)
        views = ce.getObjectsFrom(ce.get3DViews()) 
        views[0].frame()
        ce.waitForUIIdle()
        views[0].snapshot(ce.toFSPath('images')+ "\\StaticModels\\"  + str(layer) + ".png", 100, 100)
        ce.setLayerPreferences(layer, "Visible", False)
        

def printImages():
    rootPath = "assets/Materials/"
    mypath = ce.toFSPath(rootPath)
    authors = os.listdir(mypath)
    for author in authors:
        categories = os.listdir(ce.toFSPath(rootPath + author))
        for category in categories:
            path = ce.toFSPath(rootPath + author + "\\" + category )
            files = glob.glob(path + "\\*.png")
            for file in files:
                spec = 0
                bump = 0
                orm = 0
                filename = os.path.splitext(os.path.basename(file))[0]
                orginalFilename = filename
                if (filename.endswith("_d")):
                    filename  = filename.strip("_d")
                specName = os.path.join(os.path.join(os.path.dirname(file), filename), filename + "_spec.png")
                bumpName = os.path.join(os.path.join(os.path.dirname(file), filename), filename + "_norm.png")
                ormName = os.path.join(os.path.join(os.path.dirname(file), filename), filename + "_orm.png")
                if os.path.exists(specName):
                    spec = 1
                if os.path.exists(bumpName):
                    bump = 1
                if os.path.exists(ormName):
                    orm = 1
                    
    
                print("  - \"" + author + " - " + category + " - " + orginalFilename +  " - "  + str(bump) + " - " + str(spec) + " - " + str(orm) + "\"")
                


printImages()    