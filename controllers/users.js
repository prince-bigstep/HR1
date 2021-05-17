const User = require('../models/user');
const Request = require('../models/request');

module.exports.renderRegister = async (req, res) => {
    const users = await User.find({});
    res.render('users/register', { users });
};

module.exports.register = async(req, res) => {
    try {
        const {email, username, password, managerId = "admin", designation} = req.body;
        manager =  await User.findById(managerId);
        if(manager){
            const user = new User({ email, username, manager, designation });
            const registerdUser = await User.register(user, password);
            manager.mentees.push(registerdUser);
            await manager.save()
        }
        else{
            const user = new User({ email, username, designation });
            const registerdUser = await User.register(user, password);
        }
        
        req.flash('success', 'User Registered');
        res.redirect('/dashboard');
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!!');
    res.redirect('/');
};

module.exports.renderAttendance = async(req, res) => {
    const user = await User.findById(req.user._id).populate('requests');
    res.render('users/attendance', { user });
};

module.exports.markAttendance = async(req, res) => {
    const date = new Date();
    const request = new Request({ date });
    request.user = req.user;
    const  manager =  await User.findById(req.user.manager).populate('menteeRequests'); 
    let user = await User.findById(req.user._id).populate('requests')
    if (user.requests.length > 0){
        const currDate = date.toLocaleDateString();
        const lastRequest = user.requests[user.requests.length - 1];
        const lastRequestDate = lastRequest.date.toLocaleDateString();
        if (currDate === lastRequestDate){
            request.type = 'Check-out';
            if (lastRequest.type !== 'Check-in'){
                await manager.updateOne({ $pull: { menteeRequests: lastRequest._id}})
                await user.updateOne({ $pull: { requests: lastRequest._id}});
                await Request.findByIdAndDelete(lastRequest._id)
            }
        }
    }
    user = await User.findById(req.user._id).populate('requests')
    if (request.type === 'Check-out') {
        request.pair = user.requests[user.requests.length - 1];
        user.requests[user.requests.length - 1].pair = request;
        await user.requests[user.requests.length - 1].save();
    }
    user.requests.push(request)
    await user.save()
    manager.menteeRequests.push(request)
    await manager.save();
    await request.save();
    req.flash('success', 'Attendance Marked!!');
    res.redirect('/attendance');
};


module.exports.renderMenteeRequests = async(req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'menteeRequests',
        populate: {
            path: 'user'
        }
    });
    console.log(user)
    res.render('users/menteeRequests', { user });
};

module.exports.approveRequest = async (req, res) => {
    const { id } = req.params; 
    const request = await Request.findById(id);
    // requestpair = await Request.findById(request.pair)
    // if (requestpair.status === "Approved"){
    //     console.log("Date???????????",request.date.getDate())
    // }
    request.status = "Approved";
    await request.save();
    res.redirect('/mentee/requests');
};

module.exports.renderShow = async(req, res) => {
    const {employeeId} = req.query;
    const user = await User.findById(employeeId).populate('manager');
    res.render('users/show', { user });

};

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const employees = await User.find({});
    const user = await User.findById(id);
    console.log("user.manager: ", user.manager, "employees: ", employees)
    res.render('users/edit', { user, employees });

};

module.exports.updateUser = async (req, res) =>{
    const {id} = req.params;
    let user = await User.findById(id);
    let manager =  await User.findById(user.manager);
    if (JSON.stringify(user.manager) !== JSON.stringify(req.body.employee.manager)){
        await manager.updateOne({ $pull: { mentees: user._id}})
        manager =  await User.findById(req.body.employee.manager);
        manager.mentees.push(user);
        await manager.save()
    }
    user = await User.findByIdAndUpdate(id, {...req.body.employee});
    req.flash('success', 'successfully updated user')
    res.redirect(`/dashboard`)
};

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params; 
    const user = await User.findById(id);
    const manager = await User.findById(user.manager)
    if (manager){
    await manager.updateOne({ $pull: { mentees: id}})
    }
    await User.findByIdAndDelete(id);
    res.redirect('/dashboard');
};

module.exports.deleteRequest = async (req, res) => {
    const { id } = req.params; 
    const user = req.user;
    const manager = await User.findById(user.manager);
    await manager.updateOne({ $pull: { menteeRequests: id}});
    console.log("?????????", manager.menteeRequests, id, "????????")
    await user.updateOne({ $pull: { requests: id}});
    await Request.findByIdAndDelete(id);
    res.redirect('/attendance');
};



