/*
 * Copyright 2021 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 */

import { DataArray } from "@malloy-lang/malloy";
import * as lite from "vega-lite";
import { HTMLChartRenderer } from "./chart";
import { getColorScale } from "./utils";
import { DEFAULT_SPEC } from "./vega_spec";

export abstract class HTMLCartesianChartRenderer extends HTMLChartRenderer {
  abstract getMark(): "bar" | "line" | "point";

  getVegaLiteSpec(data: DataArray): lite.TopLevelSpec {
    const fields = data.getField().getFields();
    const xField = fields[0];
    const yField = fields[1];
    const colorField = fields[2];
    const sizeField = fields[3];
    const shapeField = fields[4];

    const xType = this.getDataType(xField);
    const yType = this.getDataType(yField);
    const colorType = colorField ? this.getDataType(colorField) : undefined;
    const sizeType = sizeField ? this.getDataType(sizeField) : undefined;
    const shapeType = shapeField ? this.getDataType(shapeField) : undefined;

    const mark = this.getMark();

    const colorDef =
      colorField !== undefined
        ? {
            field: colorField.getName(),
            type: colorType,
            axis: { title: colorField.getName() },
            scale: getColorScale(colorType, mark === "bar"),
          }
        : { value: "#4285F4" };

    const sizeDef = sizeField
      ? {
          field: sizeField.getName(),
          type: sizeType,
          axis: { title: sizeField.getName() },
        }
      : undefined;

    const shapeDef = shapeField
      ? {
          field: shapeField.getName(),
          type: shapeType,
          axis: { title: shapeField.getName() },
        }
      : undefined;

    const xSort = xType === "nominal" ? null : undefined;
    const ySort = yType === "nominal" ? null : undefined;

    const xDef = {
      field: xField.getName(),
      type: xType,
      sort: xSort,
      axis: { title: xField.getName() },
    };

    const yDef = {
      field: yField.getName(),
      type: yType,
      sort: ySort,
      axis: { title: yField.getName() },
    };

    return {
      ...DEFAULT_SPEC,
      width: 150,
      height: 100,
      data: {
        values: this.mapData(data),
      },
      mark,
      encoding: {
        x: xDef,
        y: yDef,
        size: sizeDef,
        color: colorDef,
        shape: shapeDef,
      },
      background: "transparent",
    };
  }
}
