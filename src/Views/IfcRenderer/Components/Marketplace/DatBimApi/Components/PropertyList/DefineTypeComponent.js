import { useState } from "react";
import {
  Grid,
  Input,
  Select,
  MenuItem,
  Slider,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";

function valuetext(value) {
  return `${value}`;
}

function isStaticProperty(property_type) {
  return property_type === "S";
}

function toBoolean(property_value) {
  if (property_value === "true" || property_value) {
    return true;
  } else {
    return false;
  }
}

function DefineTypeComponent(type, property, propertyIndex, configureProperty) {
  let component = null;
  switch (type) {
    case "Réel":
      component = (
        <Input
          type="number"
          name="text_value"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        />
      );
      break;
    case "Entier":
      component = (
        <Input
          type="number"
          name="text_value"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        />
      );
      break;
    case "Date":
      component = (
        <Input
          type="date"
          name="text_value"
          format="DD/MM/YYYY"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        />
      );
      break;
    case "Lien":
    case "Texte":
    case "Texte paramétrique":
      component = (
        <Input
          type="text"
          name="text_value"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        />
      );
      break;
    case "Liste":
      component = (
        <Select
          name="text_value"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        >
          {property.list_value.map((value, index) => (
            <MenuItem key={index} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      );
      break;
    case "Booléen":
      component = (
        <RadioGroup
          name="text_value"
          value={`${property.text_value}`}
          onChange={configureProperty(propertyIndex)}
          row
        >
          <FormControlLabel value="true" control={<Radio />} label="OUI" disabled={isStaticProperty(property.property_type)} />
          <FormControlLabel value="false" control={<Radio />} label="NON" disabled={isStaticProperty(property.property_type)} />
        </RadioGroup>
      );
      break;
    case "Intervalle":
      const marks = [
        {
          label: `${property.min_interval}`,
          value: property.min_interval,
        },
        {
          label: `${property.max_interval}`,
          value: property.max_interval,
        },
      ];
      component = (
        <Slider
          disabled={isStaticProperty(property.property_type)}
          name="text_value"
          onChange={configureProperty(propertyIndex)}
          defaultValue={parseInt(property.min_interval)}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-custom"
          min={parseInt(property.min_interval)}
          step={1}
          value={property.text_value}
          max={parseInt(property.max_interval)}
          marks={marks}
          valueLabelDisplay="auto"
        />
      );
      break;
    default:
      console.log(`Sorry, we are out of ${type}.`);
  }

  return component;
}

export default DefineTypeComponent;
