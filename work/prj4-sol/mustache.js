const fs = require('fs');
const mustache = require('mustache');

/** Reads in all '*.ms' files in list of directories templateDirs
 *  giving each an ID which matches the '*'.  The returned object
 *  provides a `render(ID, view)` function which will render object
 *  view using the template specified by ID.  Note that each template
 *  may refer to any other template by its ID using a mustache
 *  partial.
 */
function Mustache(templateDirs=[ './templates' ]) {
  this.templates = {};
  for (const templateDir of templateDirs) {
    for (const fname of fs.readdirSync(templateDir)) {
      const m = fname.match(/^([\w\-]+)\.ms$/);
      if (!m) continue;
      try {
	this.templates[m[1]] =
	  String(fs.readFileSync(`${templateDir}/${fname}`));
      }
      catch (e) {
	console.error(`cannot read ${fname}: ${e}`);
	process.exit(1);
      }
    }
  }
}

module.exports = Mustache;

Mustache.prototype.render = function(templateId, view) {
  return mustache.render(this.templates[templateId], view, this.templates);
}
