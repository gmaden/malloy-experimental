/*
 * Copyright 2022 Google LLC
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

import React, { useCallback } from "react";
import styled from "styled-components";
import { Sample } from "./types";

interface ModelSelectProps {
  samples: Sample[];
  selectedSample: Sample | undefined;
  onSelectSample: (sample: Sample) => void;
}

export const ModelSelect: React.FC<ModelSelectProps> = ({
  samples,
  onSelectSample,
  selectedSample,
}) => {
  const onSampleChange = useCallback(
    ({ target }) => {
      const sample = samples.find((sample) => sample.name == target.value);
      onSelectSample(sample || samples[0]);
    },
    [onSelectSample, samples]
  );

  return (
    <ModelSection>
      <Label htmlFor="model-select">Dataset: </Label>
      <Select
        id="model-select"
        onChange={onSampleChange}
        value={selectedSample?.name}
      >
        {samples.map((sample) => (
          <option key={sample.name} value={sample.name}>
            {sample.name}
          </option>
        ))}
      </Select>
    </ModelSection>
  );
};

const Select = styled.select`
  padding-left: 5px;
  background: none;
  border: 0;
  color: #188ff9;
  flex: auto;
`;

const Label = styled.label`
  font-size: 14px;
`;

const ModelSection = styled.div`
  display: flex;
  align-items: center;
  ${Label} {
    padding-left: 10px;
  }
`;
