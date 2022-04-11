import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from 'react-modal';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



const App = () => {
  const [data, setData] = useState<any[]>([]);
  const [dataEveryGenre, setDataEveryGenre] = useState<any[]>([]);
  const [dataEveryPerson, setDataEveryPerson] = useState<any[]>([]);
  const [checkedGenres, setCheckedGenres] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [formData, updateFormData] = useState({
    name: "",
    description: "",
    imgUrl: ""
  })

  const handleChange = (e) => {
    updateFormData({
        ...formData,
        [e.target.name]: e.target.value.trim()
    })
  }

  const handleCheck = (event) => {
    var updatedList = [...checkedGenres];
    if (event.target.checked) {
      updatedList = [...checkedGenres, event.target.value];
    } else {
      updatedList.splice(checkedGenres.indexOf(event.target.value), 1);
    }
    setCheckedGenres(updatedList);
  };

  const getMovieData = async () => {
    try {
      const data = await axios.get("https://localhost:44380/api/movie")
      console.log(data.data)
      setData(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getEveryGenre = async () => {
    try {
      const data = await axios.get("https://localhost:44380/api/movie/geteverything")
      console.log(data.data)
      setDataEveryGenre(data.data.genreModels)
    } catch (error) {
      console.log(error)
    }
  }

  const getEveryPerson = async () => {
    try {
      const data = await axios.get("https://localhost:44380/api/movie/geteverything")
      console.log(data.data)
      setDataEveryPerson(data.data.personModels)
    } catch (error) {
      console.log(error)
    }
  }

  const onFormSubmit = async() => {
    try {
      axios.post('https://localhost:44380/api/movie/add', {
        "name" : formData.name,
        "description" : formData.description,
        "imgUrl" : formData.imgUrl
    })
    } catch(error) {
      console.log(error)
    }
  }

  const editModalFill = (e) => {
    console.log(e.target.className)
    //needs to be finished to fill edit modal form with informations based on which movie edit was clicked.
    setModalIsOpen(true)
  }

  useEffect(()=>{
    getMovieData()
    getEveryGenre()
    getEveryPerson()
  },[])

  return (
    <div className="App">
      
      <div className='search-wrapper'>
        <input type="text" placeholder='Search Movie'
        onChange={(e)=>{
          setSearch(e.target.value)
        }} />
        <button className='add' onClick={()=>setModalIsOpen(true)}>Add Movie</button>
      </div>

      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Genre</StyledTableCell>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>Image Cover</StyledTableCell>
            <StyledTableCell>Edit</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data
              .filter((item) => {
                if (search === "") {
                  return item;
                } else if (
                  item.name.toLowerCase().includes(search.toLowerCase())
                ) {
                  return item;
                }
              })
              .map((item) => {
                return (
                  <StyledTableRow key={item.id}>
                    <StyledTableCell component="th" scope="row">
                      {item.name}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item.genreModels.map((i: { name: any; }) => <div>{i.name}</div>)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item.description}
                    </StyledTableCell>
                    <StyledTableCell>
                      <img src={item.imgUrl}></img>
                    </StyledTableCell>
                    <StyledTableCell>
                      <button className={item.id} onClick={editModalFill} >Edit</button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
        </TableBody>
      </Table>
    </TableContainer>

    
    <div className='modal'>
      <Modal isOpen={modalIsOpen} onRequestClose={()=>setModalIsOpen(false)} ariaHideApp={false}>
        <h2>ADD/EDIT</h2>
        <form onSubmit={onFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Product name</label>
                        <input type="text"
                               className="form-control"
                               id="name"
                               name="name"
                               required
                               placeholder="Enter product name"
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input type="text"
                               className="form-control"
                               id="description"
                               name="description"
                               required
                               placeholder="Enter description"
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imgUrl">Image Url</label>
                        <input type="text"
                               className="form-control"
                               id="imgUrl"
                               name="imgUrl"
                               required
                               placeholder="Enter image url"
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                    <h3>Which genre?</h3>
                      {dataEveryGenre.map(i => {
                        return(
                          <div key={i.id}>
                            <input value={i} type="checkbox" onChange={handleCheck}/>
                            <span>{i.name}</span>
                          </div>)
                      })}
                    </div>
                    <div className="form-group">
                      <h3>Cast:</h3>
                      {dataEveryPerson.map(i => {
                        return(
                          <div key={i.id}>
                            <input value={i} type="checkbox" onChange={handleCheck}/>
                            <span>{i.name}</span>
                          </div>)
                      })}
                    </div>
                  <button id="submit" type="submit">Submit</button>
        </form>
        <button onClick={()=>setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
    </div>
  );
}

export default App;