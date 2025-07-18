import { describe, it, expect, beforeEach } from 'vitest';
import { TarotDeck } from '../services/TarotDeck';
import { interpretationFrameworks } from '../data/interpretationFrameworks';
import { DrawnCard } from '../types';

describe('TarotDeck', () => {
  let tarotDeck: TarotDeck;

  beforeEach(() => {
    tarotDeck = new TarotDeck();
  });

  it('should initialize with all available cards', () => {
    const cards = tarotDeck['cards']; // Accessing private property for testing
    expect(cards.length).toBeGreaterThan(0); // We have at least some cards
  });

  it('should shuffle the deck', () => {
    // Store original order
    const originalOrder = [...tarotDeck['cards']];

    // Shuffle
    tarotDeck.shuffle();

    // Get new order
    const newOrder = [...tarotDeck['cards']];

    // Check if at least some cards have changed position
    let changedPositions = 0;
    for (let i = 0; i < originalOrder.length; i++) {
      if (originalOrder[i].id !== newOrder[i].id) {
        changedPositions++;
      }
    }

    // With a proper shuffle, most positions should change
    expect(changedPositions).toBeGreaterThan(originalOrder.length * 0.7);
  });

  it('should draw the specified number of cards', () => {
    const drawnCards = tarotDeck.drawCards({
      cardCount: 3,
      allowReversed: true,
      reversedProbability: 0.3,
    });
    expect(drawnCards.length).toBe(3);
  });

  it('should not draw the same card twice', () => {
    const drawnCards = tarotDeck.drawCards({
      cardCount: 10,
      allowReversed: true,
      reversedProbability: 0.3,
    });

    // Check for duplicates
    const cardIds = drawnCards.map(card => card.card.id);
    const uniqueCardIds = new Set(cardIds);

    expect(uniqueCardIds.size).toBe(cardIds.length);
  });

  it('should assign position meanings based on the interpretation framework', () => {
    const cardCount = 3;
    const drawnCards = tarotDeck.drawCards({
      cardCount,
      allowReversed: true,
      reversedProbability: 0.3,
    });

    drawnCards.forEach((card, index) => {
      const expectedMeaning =
        interpretationFrameworks[cardCount].positions[index].description;
      expect(card.positionMeaning).toBe(expectedMeaning);
    });
  });

  it('should generate reading results with interpretation', () => {
    const drawnCards: DrawnCard[] = tarotDeck.drawCards({
      cardCount: 3,
      allowReversed: true,
      reversedProbability: 0.3,
    });
    const result = tarotDeck.generateReadingResult(drawnCards, 'free');

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('type', 'free');
    expect(result).toHaveProperty('cards', drawnCards);
    expect(result).toHaveProperty('interpretation');
    expect(result.interpretation).toContain('三牌時間線');
  });

  it('should respect the reversedProbability parameter', () => {
    // Test with 100% reversed probability
    const allReversed = tarotDeck.drawCards({
      cardCount: 20,
      allowReversed: true,
      reversedProbability: 1.0,
    });
    expect(allReversed.every(card => card.isReversed)).toBe(true);

    // Reset used cards
    tarotDeck.resetUsedCards();

    // Test with 0% reversed probability
    const noneReversed = tarotDeck.drawCards({
      cardCount: 20,
      allowReversed: true,
      reversedProbability: 0.0,
    });
    expect(noneReversed.every(card => !card.isReversed)).toBe(true);
  });

  it('should respect the allowReversed parameter', () => {
    const cards = tarotDeck.drawCards({
      cardCount: 20,
      allowReversed: false,
      reversedProbability: 1.0,
    });
    expect(cards.every(card => !card.isReversed)).toBe(true);
  });

  it('should limit the card count to 9', () => {
    const cards = tarotDeck.drawCards({
      cardCount: 15,
      allowReversed: true,
      reversedProbability: 0.3,
    });
    expect(cards.length).toBe(9);
  });

  it('should get the correct interpretation framework', () => {
    for (let i = 1; i <= 9; i++) {
      const framework = tarotDeck.getInterpretationFramework(i);
      expect(framework).toEqual(interpretationFrameworks[i]);
    }
  });
});
