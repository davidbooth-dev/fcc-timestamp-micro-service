let parse = function(date_str) {
    let d;
    let s = /\d{5}/.test(date_str);
  
    if (!date_str) d = new Date();
    else if (s) d = new Date(parseInt(date_str));
    else d = new Date(date_str);
  
    return { unix: d.valueOf(), utc: d.toUTCString() };
  };
  
  exports.parser = parse;
  