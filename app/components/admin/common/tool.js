import React from 'react'

class Tool extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<section id='tools'>
        <ul class='breadcrumb' id='breadcrumb'>
          <li class='title'>{this.props.curpage}</li>
        </ul>
        <div id='toolbar'>
          {/* <div class='btn-group'>
            <a class='btn' data-toggle='toolbar-tooltip' href='#' title='Building'>
              <i class='icon-building'></i>
            </a>
            <a class='btn' data-toggle='toolbar-tooltip' href='#' title='Laptop'>
              <i class='icon-laptop'></i>
            </a>
            <a class='btn' data-toggle='toolbar-tooltip' href='#' title='Calendar'>
              <i class='icon-calendar'></i>
              <span class='badge'>3</span>
            </a>
            <a class='btn' data-toggle='toolbar-tooltip' href='#' title='Lemon'>
              <i class='icon-lemon'></i>
            </a>
          </div> */}
        </div>
      </section>)
    }
}
export default Tool;