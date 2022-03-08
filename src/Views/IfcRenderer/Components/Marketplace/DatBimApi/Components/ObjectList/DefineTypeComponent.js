import { useState } from "react";
import { Input, Select, MenuItem, Slider } from "@material-ui/core";

function valuetext(value) {
  return `${value}`;
}

function isStaticSelector(selector_type) {
  return selector_type === "S";
}

function DefineTypeComponent({
  type,
  selector,
  selectorsRequest,
  setSelectorsRequest,
  getObjectsOfAdvancedSearch,
}) {
  const [selectedRangedValues, setSelectedRangedValues] = useState([
    selector.value_min,
    selector.value_max,
  ]);

  const handleChangeIntervalCommitted = (event, selectorIndex) => {
    const newSelectorRequest = [...selectorsRequest];
    let checkExist = false;

    selectorsRequest.forEach((select, index) => {
      if (select.id === selector.id) {
        checkExist = true;
        newSelectorRequest.splice(index, 1, {
          id: select.id,
          type: select.type,
          value: selectorIndex,
        });
      }
    });

    if (!checkExist) {
      newSelectorRequest.push({
        id: selector.id,
        type: selector.type,
        value: selectorIndex,
      });
    }
    setSelectorsRequest(newSelectorRequest);
    //console.log("selectorsRequest", newSelectorRequest);
    getObjectsOfAdvancedSearch(newSelectorRequest);
    //console.log("selectorsIndex ==>", selectorIndex);
  };

  const updateSelectedRangedValues = (event, selectorIndex) => {
    //console.log("selectorIndex ==>", selectorIndex);
    setSelectedRangedValues(selectorIndex);
  };

  const handleChangeDefinitionCommitted = (event) => {
    const newSelectorRequest = [...selectorsRequest];
    let checkExist = false;

    selectorsRequest.forEach((select, index) => {
      if (select.id === selector.id) {
        checkExist = true;
        newSelectorRequest.splice(index, 1, {
          id: select.id,
          type: select.type,
          value_min: selectedRangedValues[0],
          value_max: selectedRangedValues[1],
        });
      }
    });

    if (!checkExist) {
      newSelectorRequest.push({
        id: selector.id,
        type: selector.type,
        value_min: selectedRangedValues[0],
        value_max: selectedRangedValues[1],
      });
    }
    setSelectorsRequest(newSelectorRequest);
    //console.log("selectorsRequest", newSelectorRequest);
    getObjectsOfAdvancedSearch(newSelectorRequest);
    //console.log("selectorsIndex ==>", selectorIndex);
  };

  const searchSubmit = (event, selectorIndex) => {
    // console.log("selectorsRequest", selectorsRequest);
    const newSelectorRequest = [...selectorsRequest];
    let checkExist = false;

    selectorsRequest.forEach((select, index) => {
      if (select.id === selector.id) {
        checkExist = true;
        newSelectorRequest.splice(index, 1, {
          id: select.id,
          type: select.type,
          value: selectorIndex,
        });
      }
    });

    if (!checkExist) {
      newSelectorRequest.push({
        id: selector.id,
        type: selector.type,
        value: selectorIndex,
      });
    }
    setSelectorsRequest(newSelectorRequest);
    console.log("selectorsRequest", newSelectorRequest);
    console.log("selectorsIndex ==>", selectorIndex);
  };

  const marks = [
    {
      label: `${selector.value_min}`,
      value: selector.value_min,
    },
    {
      label: `${selector.value_max}`,
      value: selector.value_max,
    },
  ];

  let component = null;
  switch (type) {
    // case 'Réel':
    //     component = <Input type="number" name="text_value" fullWidth value={selector.text_value} disabled={isStaticSelector(selector.selector_type)} onChange={configureSelector(selectorIndex)} />
    //     break;
    // case 'Entier':
    //     component = <Input type="number" name="text_value" fullWidth value={selector.text_value} disabled={isStaticSelector(selector.selector_type)} onChange={configureSelector(selectorIndex)} />
    //     break;
    // case 'Date':
    //     component = <Input type="date" name="text_value" format="DD/MM/YYYY" fullWidth value={selector.text_value} disabled={isStaticSelector(selector.selector_type)} onChange={configureSelector(selectorIndex)} />
    //     break;
    // case 'Lien':
    case "text":
      component = (
        <Input
          type="text"
          name="text_value"
          fullWidth
          value={selector.text_value}
          disabled={isStaticSelector(selector.selector_type)}
          searchSubmit={searchSubmit}
        />
      );
      break;
    case "list":
      component = (
        <Select
          name="text_value"
          fullWidth
          value={selector.text_value}
          disabled={isStaticSelector(selector.selector_type)}
          searchSubmit={searchSubmit}
        >
          {selector.list_value.map((value, index) => (
            <MenuItem key={index} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      );
      break;
    // case "booléen":
    //   component = (
    //     <RadioGroup
    //       name="text_value"
    //       value={selector.text_value}
    //       disabled={isStaticSelector(selector.selector_type)}
    //       //   onChange={configureSelector(selectorIndex)}
    //       row
    //     >
    //       <FormControlLabel value="1" control={<Radio />} label="OUI" />
    //       <FormControlLabel value="0" control={<Radio />} label="NON" />
    //     </RadioGroup>
    //   );
    //   break;
    case "interval":
      component = (
        <Slider
          defaultValue={parseInt(selector.value_min)}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={parseInt(selector.value_min)}
          max={parseInt(selector.value_max)}
          onChangeCommitted={handleChangeIntervalCommitted}
        />
      );
      break;

    case "definition":
      component = (
        <Slider
          name="text_value"
          getAriaValueText={valuetext}
          aria-labelledby="range-slider"
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          value={selectedRangedValues}
          min={parseInt(selector.value_min)}
          max={parseInt(selector.value_max)}
          onChange={updateSelectedRangedValues}
          onChangeCommitted={handleChangeDefinitionCommitted}
        />
      );
      break;
    default:
      console.log(`Sorry, we are out of ${type}.`);
  }

  return component;
}

export default DefineTypeComponent;
