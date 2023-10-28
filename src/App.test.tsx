import { render, fireEvent, screen } from '@testing-library/react';
import Game, { calculateWinner } from './App';

describe('La fonction calculateWinner', () => {
  it('Devrait renvoyer null lorsque les cases sont vides', () => {
    const squares = Array(9).fill(null);
    const winner = calculateWinner(squares);
    expect(winner).toBe(null);
  });
  
  it('Devrait renvoyer X lorsque X gagne sur la première ligne', () => {
    const squares = ['X', 'X', 'X', null, 'O', 'O'];
    const winner = calculateWinner(squares);
    expect(winner).toBe('X');
  });
  
  it("Devrait renvoyer O lorsque O gagne sur une diagonale", () => {
    const squares = ['O', 'X', 'X', null, 'O', 'X', 'X', 'X', 'O'];
    const winner = calculateWinner(squares);
    expect(winner).toBe('O');
  });
  
  it("Devrait renvoyer null lorsqu'il y a match nul", () => {
    const squares = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const winner = calculateWinner(squares);
    expect(winner).toBe(null);
  });
  
  it('Devrait renvoyer null lordque le jeux est en cours', () => {
    const squares = ['X', 'O', 'X', 'O', null, 'O', null, 'X', 'O'];
    const winner = calculateWinner(squares);
    expect(winner).toBe(null)
  });
});

describe('Game', () => {
  it('Devrait afficher le statut de jeux', () => {
    const { getByText } = render(<Game />);
    const statusElement = getByText(/JOUEUR SUIVANT :/i);
    expect(statusElement).toBeInTheDocument();
  });

  it('Devrait afficher initialement le joueur X', () => {
    render(<Game />);
    const statusElement = screen.getByText(/JOUEUR SUIVANT : X/i);
    expect(statusElement).toBeInTheDocument();
  });

  it('Devrait afficher le gagnant dans le statut en cas de victoire du O en diagonale', () => {
    render(<Game />)
    const squares = ['O', 'X', 'X', null, 'O', 'X', null, null, 'O'];
    const winner = calculateWinner(squares);
    expect(winner).toBe('O');
    const squareButtons = screen.getAllByTestId(/square-\d+/);
    fireEvent.click(squareButtons[1]);
    fireEvent.click(squareButtons[0]);
    fireEvent.click(squareButtons[2]);
    fireEvent.click(squareButtons[4]);
    fireEvent.click(squareButtons[5]);
    fireEvent.click(squareButtons[8]);
    const statusElement = screen.getByText(`GAGNANT : ${winner}`);
    expect(statusElement).toBeInTheDocument();
  });

  it('Devrait afficher le gagnant dans le statut en cas de victoire du X sur la première ligne', () => {
    render(<Game />)
    const squares = ['X', 'X', 'X', null, 'O', 'O', null, null, null];
    const winner = calculateWinner(squares);
    expect(winner).toBe('X');
    const squareButtons = screen.getAllByTestId(/square-\d+/);
    fireEvent.click(squareButtons[0]);
    fireEvent.click(squareButtons[4]);
    fireEvent.click(squareButtons[1]);
    fireEvent.click(squareButtons[5]);
    fireEvent.click(squareButtons[2]);
    const statusElement = screen.getByText(`GAGNANT : ${winner}`);
    expect(statusElement).toBeInTheDocument();
  });
});

describe('La fonction handleClick', () => {
  it('Devrait mettre à jour la case si elle est clickable', () => {
    render(<Game />);
    const squareButton = screen.getByTestId('square-0'); // Utilisation d'un attribut de test (data-testid) pour l'élément
    // Vérification de l'état initial
    expect(squareButton).toBeInTheDocument();

    // Click sur la première case
    fireEvent.click(squareButton);

    // Vérification de la case
    expect(squareButton).toHaveTextContent('X');
  });

  it('Ne devrait pas mettre à jour la case si elle a déjà été cliquée', () => {
    render(<Game />);
    const squareButton = screen.getByTestId('square-0');

    expect(squareButton).toBeInTheDocument();
    
    fireEvent.click(squareButton);
    expect(squareButton).toHaveTextContent('X');
    
    fireEvent.click(squareButton);
    expect(squareButton).toHaveTextContent('X');
  });

  it('Devrait alterner entre X et O', () => {
    render(<Game/>);
    const squareButtons = screen.getAllByTestId(/square-\d+/);
    
    fireEvent.click(squareButtons[0]);
    expect(squareButtons[0]).toHaveTextContent('X');
    
    fireEvent.click(squareButtons[1]);
    expect(squareButtons[1]).toHaveTextContent('O');
    
    fireEvent.click(squareButtons[2]);
    expect(squareButtons[2]).toHaveTextContent('X');
  });

  it("Devrait ne rien changer lorsqu'il y a un gagnant", () => {
    render(<Game />);
    const squareButtons = screen.getAllByTestId(/square-\d+/);
    fireEvent.click(squareButtons[0]);
    fireEvent.click(squareButtons[4]);
    fireEvent.click(squareButtons[1]);
    fireEvent.click(squareButtons[5]);
    fireEvent.click(squareButtons[2]);
    const statusElement = screen.getByText(/GAGNANT/i);
    expect(statusElement).toBeInTheDocument();
    fireEvent.click(squareButtons[8]);
    expect(squareButtons[8]).toHaveTextContent('');
  })
});

describe('Le bouton rejouer', () => {
  it('Devrait vider le tableau, réinitialiser le statut et rendre les cases vides cickables', () => {
    render(<Game />);
    const restartButton = screen.getByText('REJOUER');
    const squarebutton = screen.getByTestId('square-0');

    fireEvent.click(squarebutton);
    expect(squarebutton).toHaveTextContent('X');

    fireEvent.click(restartButton);
    expect(squarebutton).toHaveTextContent('');
    expect(screen.getByText('JOUEUR SUIVANT : X')).toBeInTheDocument();

    fireEvent.click(squarebutton);
    expect(squarebutton).toHaveTextContent('X');
  })
})
