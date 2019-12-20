import React from 'react'

class HeaderMiddle extends React.Component{
    constructor(props){
		super(props);
		this.actionSearch = this.actionSearch.bind(this);
	}

	actionSearch(e){
		var key = this.keysearch.value;
		localStorage.setItem("keysearch",key);
		window.location.assign("/search");
		e.preventDefault();
	}
    render(){
        return(
            <section className="header-middle">
			<div className="container">
				<div className="row">
					<div className="col-sm-12">
					
						<div className="logo">
							<a href="/"><img src="/img/logo2.png" alt="bstore logo" /></a>
						</div>
						
						<div className="header-right-callus">
							<ul className="flow-us-link link-top">
								<li><a href="#"><i className="fa fa-facebook"></i></a></li>
								<li><a href="#"><i className="fa fa-google-plus"></i></a></li>
							</ul>
						</div>
						
						<div className="categorys-product-search">
							<form method="get" className="search-form-cat" onSubmit={this.actionSearch} >
								<div className="search-product form-group">
									<input type="text" className="form-control search-form" name="searchinput" 
									placeholder="Nhập từ khóa cần tìm ... " ref={(data) => { this.keysearch = data; }}/>
									<button className="search-button" value="Search" type="submit">
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
