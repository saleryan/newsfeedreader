(function () {
    'use strict';
    var Search = React.createClass({
      
        searchHandler:function(e){
        
            e.preventDefault();
            var input=React.findDOMNode(this.refs.search);

            this.props.searchHandler(input.value.toLowerCase());
        },
        render: function () {
          
            return(
                <span className='search'>
                <input ref='search'  onChange={this.searchHandler} placeholder="filter"/>
               
                </span>
               );
        
        }
    });

    var Feed = React.createClass({
        getInitialState:function(){
            return {list:[],filteredList:[],searchText:''}
        },
        getFeed:function(url){
            var self=this;
      
            $.ajax({
                url:'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(url),               
                dataType: 'jsonp',
                type: 'GET'
            }).done(function (data) {
                if (self.isMounted()){
                      
                    self.setState({list:data.responseData.feed.entries});
                    self.search(self.state.searchText);
                }
            })
        },
        search:function(searchText){
            var regex=new RegExp(searchText,'gi');
            var filteredList=this.state.list.filter(function(feed){
                return (feed.title.match(regex)) || (feed.content.match(regex));
            });
            this.setState({filteredList:filteredList});
        },
        searchHandler:function(searchText){
            this.setState({searchText:searchText});
  
      
        },
        componentWillMount:function(){
         
            this.getFeed(this.props.url);
         

        },
        componentWillUpdate:function( nextProps,  nextState){
            if(nextProps.url!==this.props.url){
                this.getFeed(nextProps.url);
            }else{
                this.search(nextState.searchText);
            }
        },
        shouldComponentUpdate: function(nextProps, nextState) {
       
      
            return (nextProps.title !== this.props.title) || (this.state.filteredList.length!==nextState.filteredList.length) || (nextState.searchText!==this.state.searchText);
        },
        clickHandler:function(data){
      
       
            window.open(data.link,'_system');
        },
        getContent:function(str){
            return str.replace(/<(?:.|\n)*?>/gm, '')
        },
        render: function () {
          
            var self=this;
            var feeds=this.state.filteredList.map(function(feed){
                return (<li onClick={self.clickHandler.bind(null,feed)}>{feed.title}<div className='postedDate'>{feed.publishedDate}</div><div>{self.getContent(feed.content)}</div> </li>);
        });
    return (<div><Search searchHandler={this.searchHandler} /><ul className='feeds'>{feeds}</ul></div>);
  
        
}
});



///TODO: 

var Main = React.createClass({
       
    getInitialState:function(){

        return {title:feeds[0].title,url:feeds[0].links[0].url,displayed:true}
    },
    handleClick:function(feed,e){
           
        this.setState({title:feed.title, url:feed.url} );
        this.handleMenu();
    },
    handleMenu:function(){
        this.setState({displayed:!this.state.displayed});
             
        var menu=React.findDOMNode(this.refs.menu);
        menu.classList.remove(this.state.displayed ? "slidein" : "slideout");
        menu.classList.add(this.state.displayed ? "slideout" : "slidein");
             
    },
    render: function () {
        var self=this;
        var feedFragment=feeds.map(function(feed){
        
            var arr= feed.links.map(function(link){
                return (<li className={self.state.title===link.title?"highlight":""} onClick={self.handleClick.bind(null, link)}>{link.title}</li>);
   
       
    });
arr.unshift((<li className='site'>{feed.site}</li>))
return arr;

});
  
return(
   
    
     <section>
        <ul className='menu' ref="menu">
            {feedFragment}
        
       </ul>
       
        <header>
           <span onClick={self.handleMenu}>&equiv;</span>
           <h1> News Feeds</h1>
        </header>
        <div className='wrapper'>
          
              <Feed title={this.state.title} url={this.state.url} handleMenu={self.handleMenu}/>
           
       </div>
    </section>
    
          
      
   
    );
}
        
    
});

var feeds=[
    {site:'BBC News',
        links:[{
            title:'Middle East',
            url:'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml'
     
        },{
            title:'US & Canada',
            url:'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml'
       
        },{
            title:'Europe',
            url:'http://feeds.bbci.co.uk/news/world/europe/rss.xml'
     
        },{
            title:'Business',
            url:'http://feeds.bbci.co.uk/news/business/rss.xml'
          
        }]} ,  
        {site:'Reuters News',
        links:[{
            title:'UK Science',
            url:'http://mf.feeds.reuters.com/reuters/UKScienceNews'
     
        },{
            title:'UK Health',
            url:'http://mf.feeds.reuters.com/reuters/UKHealthNews'
       
        },{
            title:'Technology',
            url:'http://mf.feeds.reuters.com/reuters/technologyNews'
     
        },{
            title:'Oddly enough',
            url:'http://mf.feeds.reuters.com/reuters/UKOddlyEnoughNews'
            
        }]     
        },
{site:'CNN News',
    links:[{
        title:'Travel',
        url:'http://travel.cnn.com/rss.xml'
     
    },{
        title:'Entertainment',
        url:'http://rss.cnn.com/rss/edition_entertainment.rss'
       
    },{
        title:'Money',
        url:'http://rss.cnn.com/rss/money_news_international.rss'
     
    },{
        title:'Video',
        url:'http://rss.cnn.com/rss/cnn_freevideo.rss'
     
    }]     
}
];




React.render(<Main />, document.getElementById("root") )

   

}())