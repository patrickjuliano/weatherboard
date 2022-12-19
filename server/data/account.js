const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const locationLibrary = require('./location');
const validation = require('../validation');
const { ObjectId } = require('mongodb');

const im = require('imagemagick');
const fs = require('fs/promises');
const p = require('path');

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

async function addLocation(userId, name, lat, lon, country, state) {
    userId = validation.checkString(userId);
    name = validation.checkString(name);
    lat = validation.checkNumber(lat);
    lon = validation.checkNumber(lon);
    country = validation.checkString(country);
    if (state !== null) state = validation.checkString(state);

    const userCollection = await users();
    let user = await getUser(userId);

    let newLocation = {
        _id: ObjectId(),
        label: `${name}, ${state !== null ? state : country}`,
        lat: lat,
        lon: lon,
        name: name,
        country: country,
        state: state !== null ? state : null
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

    const updateInfo = await userCollection.updateOne({ _id: userId }, { $pull: { savedLocations: { lat: lat, lon: lon } } });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Could not remove location';

    user = await getUser(userId);
    return user;
}

async function getPfpIcon(userId) {
    userId = validation.checkString(userId);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (user === null) throw 'No user with that id';
    if (user.pfpIcon === null) return null;
    return user.pfpIcon;
}

async function getPfpMain(userId) {
    userId = validation.checkString(userId);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (user === null) throw 'No user with that id';
    if (user.pfpMain === null) return null;
    return user.pfpMain;
}

async function formatAndSetImage(file, userId) {
    userId = validation.checkString(userId);
    const userCollection = await users();

    let width = 0;
    let height = 0;
    let cropSize = 0;

    //If imgTemp folder doesn't exist it will create one, only used because git doesn't allow empty directories
    try {
        await fs.stat(process.cwd() + '/imgTemp');
    } catch (e){
        await fs.mkdir(process.cwd() + '/imgTemp', { recursive: true });
    }

    let path = process.cwd() + '/imgTemp/';
    await fs.writeFile(path+ userId + file.name, file.data, (err) => {
        if (err) throw err;
    });

    im.identify(path + userId + file.name, function(err, features){
        if (err) throw err;
        if (features.width === 0 || features.height === 0) throw 'Image incompatible';
        width = features.width;
        height = features.height;
        im.convert([path + userId + file.name, path + userId + 'temp.png'], function(err, stdout){
            if (err) throw err;
            if (width < height){
                cropSize = width;
            } else { cropSize = height; }
            im.crop({
                srcPath: path + userId + 'temp.png',
                dstPath: path + userId + 'cropped.png',
                width: cropSize,
                height: cropSize,
                quality: 1,
                gravity: "Center"
            }, function(err, result){
                if (err) throw err;
                im.resize({
                    srcPath: path + userId + 'cropped.png',
                    dstPath: path + userId + 'pfpIcon.png',
                    width: 24,
                    height: 24
                }, async function(err, result){
                    if (err) throw err;
                    try {
                        let icon = await fs.readFile(path + userId + 'pfpIcon.png');
                        if (await userCollection.countDocuments({ _id: userId }, { pfpIcon: { $exists: true } }) > 0){
                            const updateInfo1 = await userCollection.updateOne({ _id: userId }, { $unset: { pfpIcon: "" } });
                            if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount) throw 'Could not add profile picture (icon)';
                        }
                        const updateInfo2 = await userCollection.updateOne({ _id: userId }, { $addToSet: { pfpIcon: icon } });
                        if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount) throw 'Could not add profile picture (icon)';
                    } catch (e){
                        throw e;
                    }
                });
                im.resize({
                    srcPath: path + userId + 'cropped.png',
                    dstPath: path + userId + 'pfpMain.png',
                    width: 90,
                    height: 90
                }, async function(err, result){
                    if (err) throw err;
                    try {
                        let main = await fs.readFile(path + userId + 'pfpMain.png');
                        if (await userCollection.countDocuments({ _id: userId }, { pfpMain: { $exists: true } }) > 0){
                            const updateInfo1 = await userCollection.updateOne({ _id: userId }, { $unset: { pfpMain: "" } });
                            if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount) throw 'Could not add profile picture (main)';
                        }
                        const updateInfo2 = await userCollection.updateOne({ _id: userId }, { $addToSet: { pfpMain: main } });
                        if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount) throw 'Could not add profile picture (main)';
                        //Deletes user specific files
                        for (const file of await fs.readdir(path)) {
                            if (file.substring(0, userId.length) === userId){
                                await fs.unlink(p.join(path, file));
                            }
                        }
                    } catch (e){
                        throw e;
                    }
                });
            });
        });
    });
}

module.exports = {
    getUser,
    createUser,
    getSavedLocations,
    addLocation,
    removeLocation,
    formatAndSetImage,
    getPfpIcon,
    getPfpMain
}