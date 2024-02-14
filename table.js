const employee = JSON.parse(localStorage.getItem("employee")) || [];
window.onload = function loadData() {
  pagination(employee);
 
  showPrev();
  showNext();

};

const openForm = () => {
  document.getElementById("title").innerHTML = "Add Employee";
  const form = document.getElementById("myForm");
  const form2 = document.querySelector("form");
  form2.reset();
  // form.style.display === "none"
  //   ? (form.style.display = "block")
  //   : (form.style.display = "none");
  form.style.display = form.style.display === "none" ? "block" : "none"
  document.getElementById(
    "submit"
  ).innerHTML = `<button type="submit" id="submit-btn">Add Data</button>`;
};

const closeForm = () => {
  const form = document.getElementById("myForm");
  form.style.display = "none";
};

const renderData = (employee) => {
  document.getElementById("tabledata").innerHTML = "";
  if (!employee) {
    document.getElementById("tabledata").innerHTML = "No Data";
    return;
  }
  const table = document.getElementById("tabledata");
  employee.forEach((emp) => {
    const tr = document.createElement("tr");
    tr.className = "table-tr";
    tr.innerHTML = `<td class="table-td">${emp.name}</td>
      <td class="table-td">${emp.position}</td>
      <td class="table-td">${emp.office}</td>
      <td class="table-td">${emp.age}</td>
      <td class="table-td">${emp.startdate}</td>
      <td class="table-td">${emp.salary}</td>
      <td><button class="edit" onclick="editData(${emp.id})">Edit</button><button onclick="removeData(${emp.id})" class="delete">Delete</button></td>`;
    table.append(tr);
  });
};

const addData = (event) => {
  event.preventDefault();
  const emp = {};
  for (let index = 0; index < event.target.elements.length; index++) {
    const el = event.target.elements[index];
    if (el.name) {
      if (el.name === "age" || el.name === "salary") {
        emp[el.name] = Number(el.value);
      } else {
        emp[el.name] = formet(el.value);
      }
    }
  }
  emp.id = !employee.length ? 1 : employee[employee.length - 1].id + 1;

  employee.push(emp);
  localStorage.setItem("employee", JSON.stringify(employee));
  currentPage = getTotalpage(dataPerPage,employee);
  loadPagination(currentPage,dataPerPage,employee);
  document.querySelector("form").reset();
  const form = document.getElementById("myForm");
  form.style.display = "none";
};

const formet = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const removeData = (id) => {
  const conform = confirm("are your sure delete data");
  if (!conform) return;
  const foundIndex = employee.findIndex((emp) => emp.id === id);
  console.log(foundIndex);
  if (foundIndex === -1) return;
  employee.splice(foundIndex, 1);
  localStorage.setItem("employee", JSON.stringify(employee));
  loadPagination(currentPage,dataPerPage,employee)
  numberOfActive(startIndex,endIndex);
};

const searchData = () => {
  const searchItem = document.getElementById("search").value.toLowerCase();
  if (!searchItem) {
    pagination(employee);
    return;
  }
  const filterData = employee.filter((emp) => {
    const data = Object.entries(emp);
    return data.find(
      (e) => e[1].toString().toLowerCase().indexOf(searchItem) > -1
    );
    // console.log(foundvalue);
    // if (foundvalue) return emp;
  });
  pagination(filterData);
};

function numberOfActive(startIndex,endIndex) {
  document.getElementById(
    "count"
  ).innerHTML = `Showing ${startIndex+1} to ${endIndex} of ${employee.length} enteries`;
}

let currentPage = 1;
// let data = null;
let dataPerPage = null;
let page = null;

const pagination = (employee) => {
  dataPerPage = document.getElementById("req_per_page").value;
  currentPage =1;
  const div = document.querySelector(".button3");
  div.innerHTML = "";
  page = getTotalpage(dataPerPage,employee);
  for (let index = 0; index < page; index++) {
    const button = document.createElement("button");
    button.innerHTML = index +1;
    button.id = index +1;
    button.className = "pagination"
    button.addEventListener('click',function pageChange(event){
      currentPage = Number(event.target.innerText);
      loadPagination(currentPage,dataPerPage,employee);
    })
    div.append(button);
  }

  loadPagination(currentPage,dataPerPage,employee);
};

const getTotalpage = (dataPerPage,employee)=>{
  return employee.length/dataPerPage;
}

 
const loadPagination = (currentPage,dataPerPage,employee)=>{
  let startIndex = (currentPage -1) * dataPerPage;
  let endIndex = Number(startIndex) + Number(dataPerPage);
  console.log(startIndex,endIndex);
  let data = employee.slice(startIndex,endIndex);
  showPrev();
  showNext();
  numberOfActive(startIndex,endIndex);
  renderData(data);
}


const editData = (id) => {
  openForm();
  const foundIndex = employee.findIndex((emp) => emp.id === id);
  if (foundIndex === -1) return;
  document.getElementById(
    "submit"
  ).innerHTML = `<button type="button" id="submit-btn" onclick="updateData(${foundIndex},${id})">Update</button>`;
  document.getElementById("title").innerHTML = "Update Employee";
  displayData(foundIndex);
};

const displayData = (foundIndex) => {
  const form = document.querySelector("form");
  for (let index = 0; index < form.elements.length; index++) {
    if (form[index].nodeName === "INPUT") {
      form.elements[index].value =
        employee[foundIndex][form.elements[index].name];
    }
  }
};

const updateData = (foundIndex, id) => {
  const updateEmployee = {
    id: id,
    name: formet(document.getElementById("name").value),
    position: formet(document.getElementById("position").value),
    office: formet(document.getElementById("office").value),
    age: document.getElementById("age").value,
    startdate: document.getElementById("startdate").value,
    salary: document.getElementById("salary").value,
  };
  console.log(updateEmployee);
  employee.splice(foundIndex, 1, updateEmployee);
  localStorage.setItem("employee", JSON.stringify(employee));
  loadPagination(currentPage,dataPerPage,employee);
  document.querySelector("form").reset();
  closeForm();
};

let order = false;
const sortData = (data) => {
  order = !order;
  console.log(order);
  employee.sort((a, b) => {
    return order ? (a[data] > b[data] ? -1 : 1) : a[data] < b[data] ? -1 : 1;
  });
  currentPage =1;
  loadPagination(currentPage,dataPerPage,employee);
};

const showNext = ()=>{

  if(Number(currentPage) >= Number(page)){
    document.getElementById("next").style.visibility = "hidden";
    console.log(currentPage);
  }
  else{
    document.getElementById("next").style.visibility = "visible";
  }
}

const showPrev = ()=>{
  if(currentPage === 1){
    document.getElementById("prevoius").style.visibility = "hidden";
    console.log("hello");
  }
  else{
    document.getElementById("prevoius").style.visibility = "visible";
  }
} 

function getNextPage() {
  currentPage +=1;
  loadPagination(currentPage,dataPerPage,employee);
}

function getPreviousPage() {
  currentPage -=1;
 
  loadPagination(currentPage,dataPerPage,employee);
}
