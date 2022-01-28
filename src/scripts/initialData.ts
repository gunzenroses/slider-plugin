import { TOrient, TSettings } from 'utils/types';

const initialData: TSettings = {
  min: 0,
  max: 100,
  range: true,
  currentFirst: 33,
  currentSecond: 65,
  step: 1,
  orientation: TOrient.HORIZONTAL,
  tooltip: true,
  scale: true
};

export default initialData;
