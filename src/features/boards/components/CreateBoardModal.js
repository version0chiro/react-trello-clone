import { Button, Modal, Input } from 'antd';
import React, { Component } from 'react';

import { DEFAULT_COLOR } from '../../../core/constants';

export class CreateBoardModal extends Component {
    state = {
        boardTitle: '',
    };

    handleCreateBoard = (event, callback) => {
        event.preventDefault();
        const board = {
            title: this.state.boardTitle,
            color: DEFAULT_COLOR,
        };
        if (!board.title || !board.title.trim()) {
            return;
        }
        return callback(board).then(() => {
            this.setState(() => ({
                boardTitle: '',
            }));
        });
    };

    handleBoardTitleChange = (event) => {
        this.setState({
            boardTitle: event.target.value,
        });
    };

    render() {
        const { onCloseModal, onCreateBoard, visible } = this.props;

        return (
            <Modal
                title="Create board"
                width="320px"
                style={{ top: 20 }}
                visible={visible}
                onCancel={onCloseModal}
                footer={null}
            >
                <form
                    className="BoardForm"
                    onSubmit={(event) => this.handleCreateBoard(event, onCreateBoard)}
                >
                    <Input
                        className="StyledInput"
                        placeholder="Add board title"
                        onChange={(event) => this.handleBoardTitleChange(event)}
                        value={this.state.boardTitle}
                    />
                    <Button
                        type="primary"
                        onClick={(event) => this.handleCreateBoard(event, onCreateBoard)}
                    >
                        Create
                    </Button>
                </form>
            </Modal>
        );
    }
}
