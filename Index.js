const argTypes = {
    property1: {
        type: Number,
        convert: function (input) {
            const res = Number(input);
            if (Number.isNaN(res)) {
                return this.default
            }
            return res;
        },
        name: "property1",
        default: 1,
    },
    property2: {
        type: String,
        convert: function (input) {
            const res = String(input);
            return this.default;
        },
        name: "property2",
        default: "hello",
    },
    property3: {
        type: Boolean,
        convert: function (input) {
            const res = Boolean(input);
            return this.default;
        },
        name: "property3",
        default: false,
    },
    property4: {
        type: "object",
        convert: function (input) {
            try {
                return JSON.parse(input);
            } catch (e) {
                return this.default;
            }
        },
        name: "property4",
        default: { hello: "world" }
    },
    propArray: {
        type: "object",
        convert: function (input) {
            try {
                const normalizedInput = input.replace(' ', '')
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                return Array.from(normalizedInput);
            } catch (e) {
                return this.default;
            }
        },
        name: "propArray",
        default: [1, 2, 3]
    }
};

function CreateDefaultObjectFromArgTypes() {
    const defaultObject = {};
    for (var property in argTypes) {
        if (argTypes.hasOwnProperty(property)) {
            defaultObject[property] = argTypes[property].default;
        }
    }
    return defaultObject;
}

function Memoization() {
    const cache = {};

    return (...args) => {
        let property = args[0];
        let input = args[1];
        
        let propertyName = property.name;
        if (propertyName in cache) {
            let propCache = cache[propertyName]
            if (input in propCache) {
                return propCache[input];
            }
        } else {
            let value = property.convert(input);
            
            let obj = {};
            obj[input] = value;
            cache[propertyName] = obj; //Can it be rewrite more beautifier

            return value;
        }
    }
}


function buildObjectFromArguments(inputArgs) {
    const autoGeneratedObject = CreateDefaultObjectFromArgTypes();

    for (var i = 0; i < inputArgs.length; i += 2) {
        const propertyName = inputArgs[i];
        const value = inputArgs[i + 1];

        if (propertyName in argTypes && argTypes.hasOwnProperty(propertyName)) {
            const property = argTypes[propertyName];

            autoGeneratedObject[propertyName] = chache(property, value);
            //autoGeneratedObject[propertyName] = property.convert(value);
        } else {
            // Keep it as a String type value if there is no such property in the argTypes object!
            autoGeneratedObject[propertyName] = value;
        }
    }
    return autoGeneratedObject;
}


//const args = process.argv.slice(2);
const chache = Memoization();

args = ["property1", "qwerty123", "property2", "This is a string", "property3", "true", "property4", '{"Name":"Alexey", "Age":34}', "propArray", "[a, b, c]"];
console.time('firstRun');
let res = buildObjectFromArguments(args);
//console.log(res);
console.timeEnd('firstRun');


//args = ["property1", "qwerty123", "property2", "Another string", "property3", "false", "property4", '{"Name":"Denis", "Age":14}', "propArray", "[a, b, c]"];
args = ["property1", "qwerty123", "property2", "This is a string", "property3", "true", "property4", '{"Name":"Alexey", "Age":34}', "propArray", "[a, b, c]"];

console.time('secondRun');
res = buildObjectFromArguments(args);
//console.log(res);
console.timeEnd('secondRun');