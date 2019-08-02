import React,{useState,useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import ProTip from './ProTip';
import SearchBar from 'material-ui-search-bar'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import { lightGreen } from '@material-ui/core/colors';
function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {' team.'}
    </Typography>
  );
}

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    marginBottom:'20px',
    backgroundColor:'lightGreen'
  },
  
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 34,
    color:'red'
  },
  pos: {
    marginBottom: 12,
  },
});

export default function App() {

  const [data,setData] = useState( [{ 'id':'','by':'','text':'' }]);
  const [query,setQuery] = useState('');
  useEffect( ()=>{

    fetch(`https://hacker-news.firebaseio.com/v0/item/20325925.json`)
    .then(response=>response.json())
    .then(result=> {
      let promiseArray = []
      let  trimResult = result.kids.slice(0,4);
           trimResult.map( kid => {
             promiseArray.push(fetch(`https://hacker-news.firebaseio.com/v0/item/${kid}.json`).then(kiddata => kiddata.json()))
           })

         Promise.all(promiseArray).then(allPromisesData => {
           console.log(allPromisesData);
           setData(allPromisesData)
         })
    }
    )
  },[])

const classes = useStyles();
const bull = <span className={classes.bullet}>•</span>;

function searchData(e) {
  setQuery(e)
}
  return (
    <Container maxWidth="sm">
      <Box my={4}>  
      <SearchBar
      onChange={(e) => searchData(e)}
      onRequestSearch={() => console.log('onRequestSearch')}
      style={{
        margin: '0 auto',
        marginBottom:'20px',
        maxWidth: 800
      }}
    />
  
  {
      
    data.filter( duff => ( duff.by.includes(query) || duff.text.includes(query) || duff.id.toString().includes(query))
        
   )
   .map( item => {
     var myObj ={__html:item.text}
      return (
        <Card className={classes.card}>
         <CardContent>
       
          <Typography className ={classes.title} variant="h5" component="h2">
          {item.id}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
           {item.by}
          </Typography>
          <Typography dangerouslySetInnerHTML={myObj}     className ={classes.content} variant="body2" component="p">
          {/* {contentClass}    */}
          </Typography>
        </CardContent>
        <CardActions>
        </CardActions>
    </Card>
        
      )
    }
  )
     }

      </Box>
    </Container>
  );
}
