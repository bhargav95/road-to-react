import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const hW = 'Welcome to React, ';
const name = {first: "Bhargav", last: "Srinivasan"};

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

const Button = ({onClick,className='',children}) =>
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
            {children}
      </button>

const Search = ({value='',onChange,children}) =>
  <form>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={children}
    />
  </form>

const Table = ({list,pattern,onDismiss,children}) =>
<div className="table">
  {list.filter(isSearched(pattern)).map(item =>
    <div key={ item.objectID } className="table-row">
      <span style={{ width: '40%' }}>
        <a href={item.url}>{ item.title }</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
          <Button onClick={() => onDismiss(item.objectID)}
            className="button">
                  Dismiss
          </Button>
      </span>
    </div>
  )
  }
</div>


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      result: null,
      searchTerm:DEFAULT_QUERY,
    };

    this.setSearchTopStories=this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories=this.fetchSearchTopStories.bind(this);
    this.onDismiss=this.onDismiss.bind(this);
    this.onSearchChange=this.onSearchChange.bind(this);
  }

  setSearchTopStories(result){
    this.setState({result});
  }

  fetchSearchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event){
    this.setState({searchTerm:event.target.value});
  }


  onDismiss(id){
      const isNotId = item => item.objectID !== id;
      const updatedHits = this.state.result.hits.filter(isNotId);
      //TODO learn Object assign method
      //const updateResult = Object.assign({},this.state.result, updatedHits);
      this.setState({ result: {...this.state.result,hits:updatedHits} });
  }


  render() {
    const {result, searchTerm}=this.state;

    if (!result) {return null;}

    return (
      <div className="page">
        <div className="interactions">
        <Search
            value={searchTerm}
            onChange={this.onSearchChange}
        >
          Search
        </Search>
        </div>

        {
          result?
        <Table className="table"
           list={result.hits}
           pattern={searchTerm}
           onDismiss={this.onDismiss}
        >
        </Table>
        :null
        }
      </div>
    );
  }
}

export default App;
