import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background, Controls, updateEdge } from 'react-flow-renderer';
import { animat, edgeTypes, initialEdges, initialNodes } from './initial-element';

const getNodeId = () => `randomnode_${+new Date()}`;

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const yPos = useRef(0);
  const [nodeId, setNodeId] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [nodeBg, setNodeBg] = useState('');

  const edgeUpdateSuccessful = useRef(true);
  const [edgeId, setEdgeId] = useState('');
  const [slConnectType, setSlConnectType] = useState('');
  const [slAnimation, SetSlAnimation] = useState('');

  const edgesType = edgeTypes;
  const animation = animat;

  const onAdd = useCallback(() => {
    yPos.current += 30;
    const newNode = {
      id: getNodeId(),
      data: { label: 'Added node' },
      position: {
        x: 100,
        y: yPos.current
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onNodeClick = (event, object) => {
    const id = object.id;
    const nodeName = object.data.label;
    let stlBackground = '';
    if (object.style && object.style.background) {
      stlBackground = object.style.background;
    }
    setNodeId(id);
    setNodeName(nodeName);
    setNodeBg(stlBackground);
    console.log(id);
    console.log(nodeName);
    console.log(stlBackground);
  };

  const handleOnChangeLabel = (event) => {
    const value = event.target.value;
    setNodeName(value);
  }

  useEffect(() => {
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            label: nodeName
          };
        }
        return node;
      })
    });
  }, [nodeName, setNodes]);

  useEffect(() => {
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.id === nodeId) {
          node.style = {
            ...node.style,
            background: nodeBg
          };
        }
        return node;
      })
    });
  }, [nodeBg, setNodes]);

  const onNodeDrag = (event, object) => {
    const xPos = object.position.x;
    const yPos = object.position.y;
    nodes.forEach((node) => {
      if (node.id === object.id) {
        node.position.x = xPos;
        node.position.y = yPos;
      }
    });
  }

  const onEdgeClick = (event, object) => {
    console.log(object);
    const id = object.id;
    setEdgeId(id);
    console.log(id);
    let selectConnect = '';
    let selectAnimation = '';
    if (object.animated) {
      selectAnimation = 'animated';
    }
    if (object.markerEnd && object.markerEnd.type) {
      selectConnect = 'arrowclosed';
    }
    setSlConnectType(selectConnect);
    SetSlAnimation(selectAnimation);
  };

  useEffect(() => {
    setEdges((eds) => {
      return eds.map((edge) => {
        if (edge.id === edgeId) {
          edge = {
            ...edge,
            type: slConnectType
          };
        }
        return edge;
      })
    });
  }, [slConnectType, setEdges]);

  const handleOnChangeEdgesType = (event) => {
    const value = event.target.value;
    console.log(value);
    setSlConnectType(value);
  };

  const handleOnChangeAnimation = (event) => {
    const value = event.target.value;
    console.log(value);
    SetSlAnimation(value);
  }

  useEffect(() => {
    setEdges((eds) => {
      return eds.map((edge) => {
        if (edge.id === edgeId) {
          if (slAnimation === 'animated') {
            edge = {
              ...edge,
              animated: true,
              markerEnd: {
                type: null
              }
            };
          }
          if (slAnimation === 'arrowclosed') {
            edge = {
              ...edge,
              markerEnd: {
                type: slAnimation
              },
              animated: false
            };
          }
        }
        return edge;
      })
    });
  }, [slAnimation, setEdges]);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, []);

  return (
    <>
      <ReactFlow 
        style={{ width: '100%', height: '100%', position: 'absolute' }} 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        fitView 
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDrag={onNodeDrag}
        onEdgeClick={onEdgeClick}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
      >
        <div style={{position: 'absolute', top: 0, left: 0, zIndex: 99}}>
          <button onClick={onAdd}>Thêm node</button>
          <div>
            <label>label: </label>
            <input type='text' value={nodeName} onChange={handleOnChangeLabel}/>
          </div>
          <div>
            <label>background: </label>
            <input type='text' value={nodeBg} onChange={(e) => setNodeBg(e.target.value)}/>
          </div>
          <div>
            <label>select connect: </label>
            <select onChange={handleOnChangeEdgesType}>
              {
                edgesType.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))
              }
            </select>
          </div>
          <div>
            <label>select animation: </label>
            {/* <select onChange={handleOnChangeAnimation}>
              {
                animation.map((animated, index) => {
                  if (slAnimation && animated === slAnimation) {
                    return <option key={index} value={animated}>{animated}</option>
                  } else {
                    return <option key={index} value={animated}>{animated}</option>
                  }
                })
              }
            </select> */}
          </div>
        </div>
        <Background color='#333' gap={16} />
        <Controls />
      </ReactFlow>
    </>
  );
}

export default Flow;