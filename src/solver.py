import sys, os
from tkinter import *
from PIL import Image, ImageTk

def initialize_board():
    global N, board
    N = 9
    board = []
    fo = open(sys.argv[1], 'r')
    for _ in range(N):
        board.append(list(map(int, fo.readline().split('  '))))
    fo.close()

    print('\nStarting board:')
    print_board()

def solve(x, y):
    if x >= N and y >= N-1:
        print('Solution:')
        print_board()
        exit(0)

    if x >= N:
        x = 0
        y += 1

    if board[y][x] != 0:
        solve(x+1, y)
        return False

    for n in range(1, N+1):
        if is_valid(n, x, y):
            set_square(n, x, y)
            if not solve(x+1, y):
                set_square(0, x, y)

    return False

def is_valid(n, x, y):
    row = board[y]
    column = [board[i][x] for i in range(N)]
    
    if x in range(3):
        x_start = 0
    elif x in range(3,6):
        x_start = 3
    else:
        x_start = 6
    if y in range(3):
        y_start = 0
    elif y in range(3,6):
        y_start = 3
    else:
        y_start = 6
    box = [board[y_start+i][x_start+j] for i in range(3) for j in range(3)]

    return n not in row and n not in column and n not in box

def draw_board():
    return 0

def print_board():
    print()
    for i in range(N):
        for j in range(N):
            print(board[i][j], '   ', end='')
        print('\n')

def set_square(n, x, y):
    board[y][x] = n

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print('\nusage: python solver.py [game_file]\n')
        exit(1)
    
    FOOTER_HEIGHT = 100
    SQUARE_SIDE_LENGTH = 60
    BORDER_WIDTH = 3
    PADDING = 4
    GAME_SIDE_LENGTH = SQUARE_SIDE_LENGTH * 9
    WINDOW_WIDTH = GAME_SIDE_LENGTH + PADDING * 2
    WINDOW_HEIGHT = GAME_SIDE_LENGTH + FOOTER_HEIGHT

    BUTTON_SIDE_LENGTH = 55
    root = Tk()
    root.title('Sudoku Solver')
    path = os.path.dirname(os.path.realpath(__file__))
    root.iconbitmap(f'{path}/img/favicon.ico')
    root.geometry(f'{WINDOW_WIDTH}x{WINDOW_HEIGHT}')


    board = Canvas(root, width=GAME_SIDE_LENGTH+PADDING*2, height=GAME_SIDE_LENGTH+PADDING*2, bg='LIGHTGRAY')
    board.pack()

    board_path = 'img/empty_grid.png'
    board_img = ImageTk.PhotoImage(Image.open(board_path))
    board_render = Label(board, image=board_img)
    board_render.pack()
    draw_board()

    footer = Canvas(root, width=GAME_SIDE_LENGTH, height=FOOTER_HEIGHT, bg='DARKGRAY')
    footer.pack()

    root.mainloop()
    # initialize_board()
    # solve(0,0)
    # print('This game has no valid solution')
    # exit(1)