const { trimStr } = require("./utils");

let users = [];

const findUser = (user) => {
    const userName = trimStr(user.name).toLowerCase();
    const userRoom = trimStr(user.room).toLowerCase();

    return users.find(
        (u) =>
            trimStr(u.name).toLowerCase() === userName &&
            trimStr(u.room).toLowerCase() === userRoom
    );
};

const addUser = (user) => {
    const normalizedRoom = trimStr(user.room).toLowerCase();
    const normalizedUser = { ...user, room: normalizedRoom };

    const isExist = findUser(normalizedUser);
    if (!isExist) {
        users.push(normalizedUser);
    }

    const currentUser = isExist || normalizedUser;
    return { isExist: !!isExist, user: currentUser };
};

const getRoomUsers = (room) => {
    const normalizedRoom = trimStr(room).toLowerCase();
    return users.filter((u) => u.room === normalizedRoom);
};

const removeUser = (user) => {
    const found = findUser(user);

    if (found) {
        users = users.filter(
            ({ room, name }) =>
                !(trimStr(room).toLowerCase() === trimStr(found.room).toLowerCase() &&
                    trimStr(name).toLowerCase() === trimStr(found.name).toLowerCase())
        );
    }

    return found;
};

module.exports = { addUser, findUser, getRoomUsers, removeUser };
