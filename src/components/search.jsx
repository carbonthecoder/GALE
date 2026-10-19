import React from 'react';
import TextInput from 'ink-text-input';
import { FramedInput } from './framed-input.jsx';

export default function SearchBox({ value, onChange, width = 50 }) {
  return (
    <FramedInput title="Search City" width={width}>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder="type city name (e.g. London, Tokyo, New York)..."
      />
    </FramedInput>
  );
}
