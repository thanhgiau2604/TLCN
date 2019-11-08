import React from 'react'

class HeaderMiddle extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <section className="header-middle">
			<div className="container">
				<div className="row">
					<div className="col-sm-12">
					
						<div className="logo">
							<a href="/"><img src="img/logo2.png" alt="bstore logo" /></a>
						</div>
						
						<div className="header-right-callus">
							<ul className="flow-us-link link-top">
								<li><a href="#"><i className="fa fa-facebook"></i></a></li>
								<li><a href="#"><i className="fa fa-google-plus"></i></a></li>
							</ul>
						</div>
						
						<div className="categorys-product-search">
							<form action="#" method="get" className="search-form-cat">
								<div className="search-product form-group">
									<input type="text" className="form-control search-form" name="s" placeholder="Nhập từ khóa cần tìm ... " />
									<button className="search-button" value="Search" name="s" type="submit">
										<i className="fa fa-search"></i>
									</button>									 
								</div>
							</form>
						</div>
						
					</div>
				</div>
			</div>
		</section>
        )
    }
}
export default HeaderMiddle;
