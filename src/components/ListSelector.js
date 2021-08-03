import { Select, MenuItem } from "@material-ui/core";

const ListSelector = ({ options, value, setValue }) => (
  <Select
    value={value}
    onChange={(e) => {
      setValue(e.target.value);
    }}
  >
    {options.map((o) => (
      <MenuItem value={o}>{o}</MenuItem>
    ))}
  </Select>
);

export default ListSelector;
