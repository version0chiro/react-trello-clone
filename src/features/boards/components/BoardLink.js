import { Icon } from 'antd';

export const BoardLink = ({ title, favorite }) => (
    <div className="StyledBoardLink">
        <div className="Title">{title}</div>
        {favorite ? (
            <div className="Favorite">
                <Icon type="star" />
            </div>
        ) : (
            <div className="NotFavorite">
                <Icon type="star" />
            </div>
        )}
    </div>
);
