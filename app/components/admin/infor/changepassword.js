import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from '../common/navbar'
import Sidebar from '../common/sidebar'
import Tool from '../common/tool'
import $ from 'jquery'

class FormChangePassword extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (<div id='content'>
            <h3 class="text-center"><b>PERSONAL INFORMATION</b></h3>
            <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <form action="/action_page.php">
                    <div class="form-group">
                        <label for="oldpass">Old Password:</label>
                        <input type="password" class="form-control" id="oldpass" />
                    </div>
                    <div class="form-group">
                        <label for="newpass">New Password:</label>
                        <input type="password" class="form-control" id="newpass" />
                    </div>
                    <div class="form-group">
                        <label for="repass">Repeat New Password:</label>
                        <input type="password" class="form-control" id="repass" />
                    </div>
                    <div class="form-group text-center">
                        <button class="btn btn-danger"><i class="icon-save"></i> Save</button>
                    </div>
                    
                </form>
            </div>
        </div>)
    }
}

ReactDOM.render(
    <div>
        <Navbar/>
        <div id="wrapper">
            <Sidebar/>
            <Tool/>
            <FormChangePassword/>
        </div>
    </div>,document.getElementById("change-password")
)