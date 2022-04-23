import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Formik } from 'formik';

function App() {
  const [details, setDetails] = useState({
    user: []
  });
  const [formvalues,setFormvalues]=useState({});

  useEffect(async ()=>{
    var response=await axios.get('https://61fe80ffa58a4e00173c989b.mockapi.io/user/product');
    console.log(response.data);
    setDetails({user:response.data});
  },[]);

  const initialValue = {
    id:'',
    productname: '',
    productprice: '',
  };
  const validate = (formData) => {
    var errors = {};
    if (formData.productname === '') errors.productname = 'ProductName is Required';
    if (formData.productprice === '') errors.productprice = 'Price is Required';
    return errors;
  };  

  async function handleEdit(id){
  var response=details.user.filter((res)=>res.id===id);
  console.log(response[0]);
  setFormvalues({
    productname:response[0].productname,
    productprice:response[0].productprice,
    id:response[0].id,
  })

  console.log(formvalues);
  }

async function handleDelete(id){
  console.log(id);
  var response=await axios.delete(`https://61fe80ffa58a4e00173c989b.mockapi.io/user/product/${id}`);
  var user=details.user.filter((val)=> val.id!==id);
  setDetails({user});
}

const handleSubmit=async (formData,{resetForm})=>{
  if(formvalues.id){
    var res=await axios.put(`https://61fe80ffa58a4e00173c989b.mockapi.io/user/product/${formvalues.id}`,
                {productname:formData.productname,
                productprice:formData.productprice,
                });
    var index=details.user.findIndex(row=>row.id==res.data.id);  
    var user=[...details.user];
    user[index]=res.data;
    setDetails({user});     
    setFormvalues({});
    formData.productname='';
    formData.productprice='';
    resetForm();
  }
  else{
    // console.log(formData.id);
      var response = await axios.post(
        'https://61fe80ffa58a4e00173c989b.mockapi.io/user/product',
        {productname:formData.productname,productprice:formData.productprice}
        )
      console.log(response);
      var user=[...details.user];
      user.push(response.data);
      setDetails({user});
      formData.productname='';
      formData.productprice='';
      resetForm();
  }
  
}

  return (
    <>
    <div>
     <h1>Anywhere in your app!</h1>
     <Formik
       initialValues={formvalues || initialValue}
       validate={(formData)=>validate(formData)}
       onSubmit={(formData,{resetForm})=>handleSubmit(formData,{resetForm})}
       enableReinitialize
     >
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         resetForm,
         /* and other goodies */
       }) => (
        <form onSubmit={handleSubmit}>
        <div>
            <label> Product Name: </label>&nbsp;
            <input
                type="text"
                name="productname"
                value={values.productname}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <br />
            <span style={{ color: 'red' }}>
                {touched.productname && errors.productname}
            </span>
        </div>
        <br />
        <div>
            <label> Price: </label>&nbsp;
            <input
                type="text"
                name="productprice"
                value={values.productprice}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <br />
            <span style={{ color: 'red' }}>
                {touched.productprice && errors.productprice}
            </span>
        </div>
        <br />
        <div>
            <button type="submit" disabled={isSubmitting}>
                Submit
            </button>
            &nbsp;
            <button type="reset" onClick={resetForm}> Reset </button>&nbsp;
        </div>
    </form>
       )}
     </Formik>
   </div>
   <br />
   <br />
   <div>
   <table border={1} style={{textAlign:"center"}}>
        <thead>
        <tr>
          <td>ProdID</td>
          <td>ProdName</td>
          <td>Prod Price</td>
          <td>Action</td>
        </tr>
        </thead>
        {details.user.map((ele)=>{
          return(
            <tr>
              <td>{ele.id}</td>
              <td>{ele.productname}</td>
              <td>{ele.productprice}</td>
              <td>
                <button onClick={()=>handleEdit(ele.id)}>Edit</button> &nbsp;
                <button onClick={()=>handleDelete(ele.id)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </table>
   </div>
    </>  
  );
}

export default App;