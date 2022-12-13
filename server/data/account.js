const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const locationLibrary = require('./location');
const validation = require('../validation');
const { ObjectId } = require('mongodb');

async function getUser(id) {
    id = validation.checkString(id);

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });
    if (user === null) throw 'No user with that id';

    return user;
}

async function checkUser(id) {
    id = validation.checkString(id);
    try {
        const user = await getUser(id);
        return true;
    } catch (e) {
        return false;
    }
}

async function createUser(id) {
    id = validation.checkString(id);
    
    const userExists = await checkUser(id);
    if (userExists) throw 'User already exists';

    const userCollection = await users();
    let newUser = {
        _id: id,
        savedLocations: []
    }

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';

    return newUser;
}

async function getOrCreateUser(id) {
    let user;
    try {
        user = await getUser(userId);
    } catch (e) {
        user = await createUser(userId);
    }
    return user;
}

async function getSavedLocations(userId) {
    userId = validation.checkString(userId);
    
    let user = await getOrCreateUser(userId);
    
    return user.savedLocations;
}

async function addLocation(userId, name, lat, lon) {
    userId = validation.checkString(userId);
    name = validation.checkString(name);
    lat = validation.checkNumber(lat);
    lon = validation.checkNumber(lon);

    const userCollection = await users();
    let user = await getUser(userId);
    const location = await locationLibrary.getSpecificLocation(name, lat, lon);

    let newLocation = {
        _id: ObjectId(),
        label: `${location.name}${'state' in location ? `, ${location.state}` : ('country' in location ? `, ${location.country}` : '')}`,
        lat: location.lat,
        lon: location.lon,
        name: location.name,
        country: location.country,
        state: 'state' in location ? location.state : null
    }

    const updateInfo = await userCollection.updateOne({ _id: userId }, { $addToSet: { savedLocations: newLocation } });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not add location';

    user = await getUser(userId);
    return user;
}

async function removeLocation(userId, name, lat, lon) {
    userId = validation.checkString(userId);
    name = validation.checkString(name);
    lat = validation.checkNumber(lat);
    lon = validation.checkNumber(lon);

    const userCollection = await users();
    let user = await getUser(userId);
    const location = await locationLibrary.getSpecificLocation(name, lat, lon);

    const updateInfo = await userCollection.updateOne({ _id: userId }, { $pull: { savedLocations: { lat: location.lat, lon: location.lon } } });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not remove location';

    user = await getUser(userId);
    return user;
}

module.exports = {
    getUser,
    createUser,
    getSavedLocations,
    addLocation,
    removeLocation
}