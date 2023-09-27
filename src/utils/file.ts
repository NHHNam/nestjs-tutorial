import * as fs from 'fs';
const saveFile = (oldPath: string, newPath: string) => {
  fs.rename(oldPath, `./public/${newPath}`, (err) => {
    if (err) throw err;
    return 'OK';
  });
};
export { saveFile };
