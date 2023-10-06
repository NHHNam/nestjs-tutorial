import { pick } from 'lodash';

const getInfoData = ({
  fields = [],
  data = {},
}: {
  fields: Array<string>;
  data: any;
}) => {
  return pick(data, fields);
};

const getInfoDataForArray = ({
  fields = [],
  data = [],
}: {
  fields: Array<string>;
  data: Array<any>;
}) => {
  return data.map((item) => {
    return pick(item, fields);
  });
};

export { getInfoData, getInfoDataForArray };
