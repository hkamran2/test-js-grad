/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */
const axios = require('axios');
module.exports = async function organiseMaintainers() {
  const response = await axios.post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
    url: "https://api.npms.io/v2/search/suggestions?q=react",
    method: "GET",
    return_payload: true
  });

  const content = response.data.content

  const map = new Map();
  content.forEach(el => {
    const objPackage = el.package;
    const { name } = objPackage;
    const packageMaintainers = objPackage.maintainers.map(m => m.username);

    packageMaintainers.forEach(maintainer => {
      if (!map.has(maintainer)) {
        map.set(maintainer, [name]);
      } else {
        const packages = map.get(maintainer);
        packages.push(name);
        packages.sort();
        map.set(maintainer, packages);
      }
    });
  });

  return [...map].map(([name, value]) => ({ username: name, packageNames: value })).sort((a, b) => a.username.localeCompare(b.username));
};
