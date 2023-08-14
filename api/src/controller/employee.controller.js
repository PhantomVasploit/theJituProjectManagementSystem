const mssql = require('mssql');
const { sqlConfig } = require('../config/database.connection.config');
const { updateSchema } = require('../utils/validator');

//should help in executing the queries and errors
const executeQuery = async (query) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const request = pool.request();
        return await query(request);
    } catch (error) {
        throw 'Internal server error';
    }
}

module.exports.getAllEmployees = async (req, res) => {
    try {
        const result = await executeQuery(request => request.execute('fetchAllUser'));
        const employees = result.recordset.map(record => {
            const { password, is_admin, ...employee } = record;
            return employee;
        });
        return res.status(200).json({ employees });
    } catch (error) {
        return res.status(500).json({ error});
    }
};

module.exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await executeQuery(request => request.input('id', id).execute('fetchUserByIdPROC'));
        const { password, is_admin, ...employee } = result.recordset[0];
        return res.status(200).json({ 
            message: 'Fetch successful', employee
         });
    } catch (error) {
        return res.status(500).json({ error});
    }
};

module.exports.updateEmployeeAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email } = req.body;
        const { error } = updateSchema.validate({ firstName, lastName, email });

        if (error) {
            return res.status(422).json({ error: error.message });
        }

        const result = await executeQuery(request => request.input('id', id).execute('fetchUserByIdPROC'));

        if (result.recordset.length <= 0) {
            return res.status(404).json({ error: `User not found` });
        }

        await executeQuery(request => request
            .input('id', id)
            .input('first_name', firstName)
            .input('last_name', lastName)
            .input('email', email)
            .execute('updateUserAccountPROC'));

        const userResult = await executeQuery(request => request.input('email', email).execute('fetchUserByEmailPROC'));
        const { password, is_verified, is_assigned, ...user } = userResult.recordset[0];
        return res.status(200).json({ message: 'Update successful', user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports.deleteEmployeeAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await executeQuery(request => request.input('id', id).execute('fetchUserByIdPROC'));

        if (result.recordset.length <= 0) {
            return res.status(404).json({ error: 'Account to delete not found' });
        }

        await executeQuery(request => request.input('id', id).execute('deleteUserAccount'));
        return res.status(200).json({ message: `Account deleted successfully` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error});
    }
};


module.exports.getEmployeeProjects = async(req, res)=>{
    
    try {
        const {id} = req.params
        const pool = await mssql.connect(sqlConfig)

        const projects = await pool
        .request()
        .input('user_id', id)
        .execute('sp_getUserProjects')

        if(projects.rowsAffected[0] >= 1){
            res.status(200).json({message: 'Fetch successful', projects: projects.recordset})
        }else{
            res.status(404).json({message: 'No assigned projects'})
        }

    } catch (error) {
        
    }
}