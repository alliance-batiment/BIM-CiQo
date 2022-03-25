import * as WebIFC from "web-ifc";
import {
  IFCDIRECTION,
  IFCCOLUMN,
  IFCCARTESIANPOINT,
  IFCAXIS2PLACEMENT3D,
  IFCAXIS2PLACEMENT2D,
  IFCLOCALPLACEMENT,
  IFCCIRCLEPROFILEDEF,
  IFCEXTRUDEDAREASOLID,
  IfcCartesianPoint
} from 'web-ifc';


let EID = 100000;

function real(v) {
  return { type: 4, value: v }
}

function ref(v) {
  return { type: 5, value: v }
}

function empty() {
  return { type: 6 }
}

function str(v) {
  return { type: 1, value: v }
}

function enm(v) {
  return { type: 3, value: v }
}

function Point(model, api, o) {
  let ID = EID++;
  console.log('ID POINT', ID)
  let pt = new WebIFC.IfcCartesianPoint(ID,
    IFCCARTESIANPOINT,
    [real(o.x), real(o.y), real(o.z)]);
  console.log('pt  POINT', ID)
  // api.WriteLine(model, pt);
  let rawLineIfcCartesianPoint = {
    ID: pt.expressID,
    type: pt.type,
    arguments: pt.ToTape()
  };
  console.log('rawLineIfcCartesianPoint', rawLineIfcCartesianPoint)
  api.WriteRawLineData(model, rawLineIfcCartesianPoint);
  return ref(ID);
}

function Dir(model, api, o) {
  let ID = EID++;
  let pt = new WebIFC.IfcDirection(ID,
    IFCDIRECTION,
    [real(o.x), real(o.y), real(o.z)]);
  api.WriteLine(model, pt);
  return ref(ID);
}

function Point2D(model, api, o) {
  let ID = EID++;
  console.log('ID', ID)
  let pt = new WebIFC.IfcCartesianPoint(ID,
    IFCCARTESIANPOINT,
    [real(o.x), real(o.y)]);
  console.log('model', model)
  console.log('pt', pt);
  console.log('api', api);
  // console.log('ifcApi', ifcApi);

  // api.WriteLine(model, pt);

  let rawLineIfcCartesianPoint = {
    ID: pt.expressID,
    type: pt.type,
    arguments: pt.ToTape()
  };
  console.log('rawLineIfcCartesianPoint', rawLineIfcCartesianPoint)
  api.WriteRawLineData(model, rawLineIfcCartesianPoint);
  return ref(ID);
}

function AxisPlacement(model, api, o) {
  let locationID = Point(model, api, o);
  let ID = EID++;
  let pt = new WebIFC.IfcAxis2Placement3D(ID,
    IFCAXIS2PLACEMENT3D,
    locationID,
    empty(),
    empty());
  api.WriteLine(model, pt);
  return ref(ID);
}

function AxisPlacement2D(model, api, o) {
  let locationID = Point2D(model, api, o);
  let ID = EID++;
  let pt = new WebIFC.IfcAxis2Placement2D(ID,
    IFCAXIS2PLACEMENT2D,
    locationID,
    empty());
  api.WriteLine(model, pt);

  return ref(ID);
}

function Placement(model, api, o) {
  let axisID = AxisPlacement(model, api, o);
  let ID = EID++;
  let pt = new WebIFC.IfcLocalPlacement(ID,
    IFCLOCALPLACEMENT,
    empty(),
    axisID);
  api.WriteLine(model, pt);
  return ref(ID);
}

function CircleProfile(model, api, rad, o) {
  let ID = EID++;
  let pt = new WebIFC.IfcCircleProfileDef(ID,
    IFCCIRCLEPROFILEDEF,
    enm("AREA"),
    str('column-prefab'),
    AxisPlacement2D(model, api, o),
    real(rad));
  api.WriteLine(model, pt);
  return ref(ID);
}

function ExtrudedAreaSolid(model, api, pos, dir, rad, len) {
  let ID = EID++;
  let pt = new WebIFC.IfcExtrudedAreaSolid(ID,
    IFCEXTRUDEDAREASOLID,
    CircleProfile(model, api, rad, { x: 0, y: 0 }),
    AxisPlacement(model, api, pos),
    Dir(model, api, dir),
    real(len));
  api.WriteLine(model, pt);
  return ref(ID);
}

function StandardColumn(model, api, pos) {
  let shapeID = ExtrudedAreaSolid(model, api,
    { x: -2, y: 0, z: -1 },
    { x: 0, y: 0, z: 1 },
    0.25,
    2);

  let ID = EID++;
  let pt = new WebIFC.IfcColumn(ID,
    IFCCOLUMN,
    str("GUID"),
    empty(),
    str("name"),
    empty(),
    str("label"),
    Placement(model, api, pos),
    shapeID,
    str("sadf"),
    empty());
  api.WriteLine(model, pt);
  return ref(ID);
}

function BuildModel(model, api) {
  console.log("Building model " + model);

  const gridSize = 1;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      StandardColumn(model, api, { x: i + 20, y: j+ 20, z: 0 });
    }
  }
}

export {
  BuildModel
}
