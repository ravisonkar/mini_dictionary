import React from 'react';
import './App.css';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      search_word: '',
      search_word_definitions: [],
      loader_visible: false,
      word_not_found_message: '',
      word_not_found_message_visible: false
    }
  }

  inputWordHandler = (event) => {
    this.setState({
      search_word: event.target.value
    })

  }

  submitHandler = () => {
    try {
      if (this.state.search_word!=="") {
        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.state.search_word}`).then((res) => {
          if (res.status === 200) {

            this.setState({
              loader_visible: true,
              word_not_found_message_visible: false
            })

            var definition_data = []

            res.data[0].meanings.map((definitions_object) => (
              definitions_object.definitions.map(async (definition) => (
                await definition_data.push(definition)
              ))
            ))

            this.setState({
              search_word_definitions: definition_data,
              loader_visible: false
            })

          } else {
            this.setState({
              word_not_found_message: "Sorry pal, we couldn't find definitions for the word you were looking for.",
              word_not_found_message_visible: true
            })
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
        <div style={{ border: '1px solid black', margin: 'auto', maxWidth: window.innerWidth < 600 ?'100%' : '50%',height:'90vh',overFlow:'auto',background:'skyblue'}}>
          <div className='d-flex justify-content-center'>
            <form>
              <h1 className='mt-3 text-center border-bottom'>Mini Dictionary</h1>
              <div className="form-group d-flex mt-5">
                <input type="text" className="form-control" placeholder="Search word" onChange={this.inputWordHandler} required />
                <button type="button" className="btn btn-primary mx-1" onClick={this.submitHandler}>Submit</button>
              </div>
            </form>
          </div>

          <div className='d-flex justify-content-center mt-3'> {this.state.search_word_definitions.length > 1 ? (<h5>Definitions</h5>) : ""}</div>

          <div className='d-flex justify-content-center mt-3 px-4'>
            <ul className={this.state.search_word_definitions.length > 4 ? 'overflow bg-light' : ''}>
              {this.state.search_word_definitions.map((definitions) => (
                <li className='p-3 border'>{definitions.definition}</li>
              ))}
            </ul>
          </div>

          {this.state.loader_visible === true ? (
            <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
              </div>
            </div>
          ) : ""}

          <div className='d-flex justify-content-center'>
            {this.state.word_not_found_message_visible === true ? (
              <div>{this.state.word_not_found_message}</div>
            ) : ""}
          </div>

        </div>
    )
  }
}
export default App
