import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { List } from 'antd';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Cards from '../components/Cards';
import { onceGetLists, doCreateList, doDeleteList, updateList } from '../api/list';
import { deleteBoard, editBoard, getBoard, updateBoard } from '../api/board';
import { FormCreation } from '../components/FormCreation';
import { ListHeader } from '../components/ListHeader';
import { Spinner } from '../../../shared/components/Spinner';
import { mergeDataWithKey } from '../../../shared/utils';
import { withAuthorization } from '../../../auth/utils/AuthHOC';
import { AddList, Lists } from '../styles';
import BoardHeader from '../components/BoardHeader';

const BoardPage = () => {
    const [loading, setLoading] = useState(false);
    const [board, setBoard] = useState({});
    const [boardKey, setBoardKey] = useState('');
    const [lists, setLists] = useState([]);

    useEffect(() => {
        setLoading(true);

        const boardKey = window.location.href.split('/').pop();
        Promise.all([getBoard(boardKey), onceGetLists(boardKey)])
            .then((snapshots) => {
                const board = snapshots[0].val();
                const lists = mergeDataWithKey(snapshots[1].val());

                setBoardKey(boardKey);
                setBoard(board);
                setLists(lists);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleCreateList = async (listTitle) => {
        const response = await doCreateList(boardKey, { title: listTitle });

        setLists([...lists, response]);
    };

    const handleUpdateList = async (listKey, title) => {
        const response = await updateList(boardKey, listKey, { title });
        const updatedLists = [...lists];
        updatedLists[updatedLists.findIndex((list) => list.key === listKey)] = {
            ...response,
            key: listKey,
        };

        setLists(updatedLists);
    };

    const handleDeleteList = async (listKey) => {
        await doDeleteList(boardKey, listKey);
        const filteredLists = lists.filter((list) => list.key !== listKey);
        setLists(filteredLists);
    };

    const handleAddToFavorites = async () => {
        const updatedBoard = { ...board };
        updatedBoard.favorite = !updatedBoard.favorite;
        await editBoard(boardKey, updatedBoard);
        setBoard(updatedBoard);
    };

    const handleDeleteBoard = async (boardKey) => {
        await deleteBoard(boardKey);

        window.location('/boards');
    };

    const handleUpdateBoard = async (boardKey, title) => {
        await updateBoard(boardKey, title);
        setBoard({ ...board, ...title });
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <BoardHeader
                title={board.title}
                favorite={board.favorite}
                boardKey={boardKey}
                onAddToFavorites={handleAddToFavorites}
                deleteBoard={handleDeleteBoard}
                updateBoard={handleUpdateBoard}
            />
            <Lists>
                {lists.map((list, index) => (
                    <List key={index}>
                        <ListHeader
                            listKey={list.key}
                            listTitle={list.title}
                            onEditList={handleUpdateList}
                            onDeleteList={handleDeleteList}
                        />
                        <Cards list={list} />
                    </List>
                ))}
                <AddList>
                    <FormCreation placeholder="Create new list" onCreate={handleCreateList} />
                </AddList>
            </Lists>
        </>
    );
};

export default withRouter(
    withAuthorization((authUser) => !!authUser)(DragDropContext(HTML5Backend)(BoardPage))
);
