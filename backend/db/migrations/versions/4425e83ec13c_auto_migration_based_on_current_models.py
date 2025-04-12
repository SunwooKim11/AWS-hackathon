"""auto migration based on current models

Revision ID: 4425e83ec13c
Revises: 111efbcfc044
Create Date: 2025-04-13 04:10:21.209368

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4425e83ec13c'
down_revision: Union[str, None] = '111efbcfc044'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('affiliation', sa.String(), nullable=True),
    sa.Column('google_scholar_id', sa.String(), nullable=False),
    sa.Column('profile_image_url', sa.Text(), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('user_id')
    )
    op.create_table('current_study',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('title', sa.Text(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('authors', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
    sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
    sa.Column('equipments', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('reagents', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('vector_embedding_id', sa.UUID(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('interests',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('keyword', sa.String(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('papers',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('title', sa.Text(), nullable=False),
    sa.Column('abstract', sa.Text(), nullable=False),
    sa.Column('year', sa.Integer(), nullable=True),
    sa.Column('journal', sa.String(), nullable=False),
    sa.Column('doi', sa.String(), nullable=True),
    sa.Column('authors', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
    sa.Column('equipments', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('reagents', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('vector_embedding_id', sa.UUID(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tools',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('keyword', sa.String(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('tools')
    op.drop_table('papers')
    op.drop_table('interests')
    op.drop_table('current_study')
    op.drop_table('users')
    # ### end Alembic commands ###
