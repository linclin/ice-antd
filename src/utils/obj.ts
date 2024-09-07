export function RemoveEmptyKeys(obj: any): any {
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
        delete obj[key];
      }
    });
    return obj;
  }