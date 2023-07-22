const fs = require('fs');

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

exports.getAllUsers = (req, res) => {
    res.status(200).json({
        status : 'success',
        results : users.length,
        data : { users }
    })
}

exports.getUser = (req, res) => {
    const id = req.params.id * 1;   
    const user = users.find(el => el._id === id);
    if(!user) {
        res.status(404).json({
            status : 'fail',
            message : 'Invalid ID'
        })
    }
    res.status(200).json({
        status : 'success',
        data : { user }
    })
}

exports.createUser = (req, res) => {
    const newId = users[users.length - 1]._id + 1;
    const newUser = Object.assign({ _id : newId}, req.body);
    users.push(newUser);

    fs.writeFile(`${__dirname}/../dev-data/data/users.json`, JSON.stringify(users, null, 2), err => {
        res.status(201).json({
            status: 'success',
            data : { newUser }
        })
    })
}

exports.updateUser = (req, res) => {
    const id = req.params.id * 1;
    const user = users.find(el => el._id === id);
    if(!user) {
        res.status(404).json({
            status : 'fail',
            message : 'Invalid ID'
        })
    }

    const newUser = {...user, ...req.body};

    const newUsers = users.map(user => 
        user._id === newUser._id ? newUser : user
    )

    fs.writeFile(`${__dirname}/../dev-data/data/users.json`, JSON.stringify(newUsers, null, 2), err => {
        res.status(201).json({
            status: 'success',
            data : { updatedUser : newUser }
        })
    })
}