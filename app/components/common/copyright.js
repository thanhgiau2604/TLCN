import React from 'react'

class CopyRight extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
			<footer className="copyright-area">
				<div className="container">
					<div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="copy-right">
								<address>Copyright © 2019 <a href="http://bootexperts.com/">SHOELG</a> All Rights Reserved</address>
							</div>
							<div className="scroll-to-top">
								<a href="#" className="bstore-scrollertop"><i className="fa fa-angle-double-up"></i></a>
							</div>
						</div>
					</div>
				</div>
			</footer>  )
    }
}
export default CopyRight;
