import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MaterialTable from 'material-table';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Table } from 'antd';
import 'react-virtualized/styles.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {
  Column,
  Table as VirtualisedTab,
  SortDirection,
  AutoSizer,
  List,
  InfiniteLoader,
} from 'react-virtualized';
import List from "@researchgate/react-intersection-list";
import "intersection-observer";

// You can import any component you want as a named export from 'react-virtualized', eg

// But if you only use a few react-virtualized components,
// And you're concerned about increasing your application's bundle size,
// You can directly import only the components you need, like so:

function MaterialUITable({ data }) {
  return (
    <MaterialTable
      options={{
        paging: false,
      }}
      title="Simple Action Preview"
      columns={[
        { title: 'Id', field: 'id' },
        { title: 'User Id', field: 'userId' },
        { title: 'Tile', field: 'title' },
        {
          title: 'Completed',
          field: 'completed',
        },
      ]}
      data={data}
    />
  );
}

function IntersectionList() {
  const itemsRenderer = (items, ref) => <ul ref={ref}>{items}</ul>;

  const itemRenderer = (index, key) => (
    <li style={styles.listItem} key={key}>{`Row ${index}`}</li>
  );

  const renderList = () => {
    return (
      <List
        itemCount={5000}
        itemsRenderer={itemsRenderer}
        renderItem={itemRenderer}
        pageSize={50}
      />
    );
  };

  return (
    <div>
      <div style={styles.list}>{renderList()}</div>
    </div>
  );
}

function AgGridTable() {
  const list = Array.from({ length: 1000 }, (v, i) => {
    const names = ['Hari', 'Sameer', 'Neeraj', 'Snigdha', 'Mamtha'];
    return {
      id: i,
      name: names[Math.floor(Math.random() * names.length)],
    };
  });

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
    },
    {
      headerName: 'Name',
      field: 'name',
    },
  ];

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: '700px',
        width: '100%',
      }}
    >
      <AgGridReact columnDefs={columnDefs} rowData={list}></AgGridReact>
    </div>
  );
}

function VirtualisedTable({ data = [] }) {
  // const rowRenderer = ({ index, key, style }) => {
  //   let content;
  //   console.log(index, 'indexindexindex');
  //   if (!isRowLoaded({ index })) {
  //     content = 'Loading...';
  //   } else {
  //     content = data[index].id;
  //   }

  //   return (
  //     <div key={key} style={style}>
  //       {content}
  //     </div>
  //   );
  // };

  // const isRowLoaded = ({ index }) => index < data.length;

  return (
    <div style={{ height: 470 }}>
      {/* <InfiniteLoader
        isRowLoaded={isRowLoaded}
        // loadMoreRows={loadMoreRows}
        rowCount={data.length}
      >
        {({ onRowsRendered, registerChild }) => (
          <List
            height={200}
            overscanRowCount={10}
            onRowsRendered={onRowsRendered}
            ref={registerChild}
            rowCount={data.length}
            rowHeight={20}
            rowRenderer={rowRenderer}
            width={300}
          />
        )}
      </InfiniteLoader> */}
      <AutoSizer>
        {({ width, height }) => {
          return (
            <VirtualisedTab
              width={width}
              height={height}
              headerHeight={30}
              rowHeight={40}
              rowCount={data.length}
              overscanRowCount={10}
              rowGetter={({ index }) => data[index]}
            >
              <Column label="Id" dataKey="id" width={200} />
              <Column width={300} label="User Id" dataKey="userId" />
              <Column label="Title" dataKey="title" width={200} />
              <Column width={300} label="Completed" dataKey="completed" />
            </VirtualisedTab>
          );
        }}
      </AutoSizer>
    </div>
  );
}

class AntRow extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { text } = this.props;
    return <a>{text}</a>;
  }
}

const AntDesignTable = React.memo(
  ({ data = [] }) => {
    const [allData, setAllData] = useState(data.slice());
    const [selectedRow, setSelectedRow] = useState(null);
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows
        );
        setSelectedRow(selectedRows);
      },
      type: 'checkbox',

      // getCheckboxProps: (record) => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    };

    const copiedData = allData.slice();

    // useEffect(() => {
    //   const interval = setTimeout(() => {
    //     copiedData.splice(0, 1, {
    //       ...copiedData[0],
    //       title: 'changed',
    //     });
    //     setAllData(copiedData);
    //   }, 3000);
    //   return () => {
    //     clearTimeout(interval);
    //   };
    // }, []);

    const columns = [
      {
        title: 'Id',
        key: 'id',
        dataIndex: 'id',
        render: (text) => {
          console.log(text, 'texttexttexttext');
          return <AntRow text={text} />;
        },
      },
      { title: 'User Id', key: 'userId', dataIndex: 'userId' },
      { title: 'Title', key: 'title', dataIndex: 'title' },
      {
        title: 'Completed',
        key: 'completed',
        dataIndex: 'completed',
      },
    ];

    return (
      <Table
        rowSelection={rowSelection}
        rowKey={(record, index) => index}
        pagination={false}
        dataSource={allData}
        columns={columns}
      />
    );
  },
  (nextProps, prevProps) => {
    return !(
      JSON.stringify(nextProps.selectedRow) !==
      JSON.stringify(prevProps.selectedRow)
    );
  }
);

function App() {
  const [showTableType, setTableType] = useState('Virtualised');
  let prevData = [];
  const [data, setData] = useState([]);
  const getData = () => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((json) => {
        prevData = json;
        setData(
          json
            .concat(json)
            .concat(json)
            .concat(json)
            .concat(json)
            // .concat(json)
            // .concat(json)
            // .concat(json)
            // .concat(json)
            // .concat(json)
            .map((d, index) => ({
              ...d,
              key: `'${index}'`,
              id: index,
            }))
        );
      });
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(data.length, 'datadatadatadata');

  return (
    <div
      className="App"
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <div
        className="App"
        style={{
          marginBottom: 20,
        }}
      >
        <button onClick={() => setTableType('MaterialUI')}>
          Material Table
        </button>
        <button
          style={{
            marginLeft: 10,
          }}
          onClick={() => setTableType('AntDesign')}
        >
          Ant Design Table
        </button>
        <button
          style={{
            marginLeft: 10,
          }}
          onClick={() => setTableType('Virtualised')}
        >
          Virtualised Table
        </button>
        <button
          style={{
            marginLeft: 10,
          }}
          onClick={() => setTableType('AgGrid')}
        >
          AGGrid Table
        </button>
        <button
          style={{
            marginLeft: 10,
          }}
          onClick={() => setTableType('Intersection List')}
        >
          Intersection List
        </button>
      </div>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {showTableType === 'MaterialUI' && <MaterialUITable data={data} />}
      {showTableType === 'AntDesign' && <AntDesignTable data={data} />}
      {showTableType === 'Virtualised' && <VirtualisedTable data={data} />}
      {showTableType === 'AgGrid' && <AgGridTable />}
      {showTableType === "Intersection List" && <IntersectionList />}
    </div>
  );
}

export default App;
