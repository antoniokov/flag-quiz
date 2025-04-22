import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlagOption from '../../components/FlagOption';

// Mock for image loading
class MockImage {
  onload: () => void = () => {};
  set src(value: string) {
    setTimeout(() => this.onload(), 100);
  }
}

describe('FlagOption', () => {
  const mockCountry = { 
    name: 'Canada', 
    code: 'CA' 
  };
  
  const mockOnClick = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Replace the global Image constructor with our mock
    window.Image = MockImage as any;
  });
  
  it('should render the country name', () => {
    render(
      <FlagOption 
        country={mockCountry} 
        onClick={mockOnClick} 
        selectedAnswer={null}
        correctAnswer="US"
        voiceSelected={false}
      />
    );
    
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });
  
  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    render(
      <FlagOption 
        country={mockCountry} 
        onClick={mockOnClick} 
        selectedAnswer={null}
        correctAnswer="US"
        voiceSelected={false}
      />
    );
    
    const optionElement = screen.getByText('Canada');
    await user.click(optionElement);
    
    expect(mockOnClick).toHaveBeenCalled();
  });
  
  it('should apply correct class when it is the correct answer', () => {
    render(
      <FlagOption 
        country={mockCountry} 
        onClick={mockOnClick} 
        selectedAnswer="CA"
        correctAnswer="CA"
        voiceSelected={false}
      />
    );
    
    const optionElement = screen.getByText('Canada').closest('.flag-option');
    expect(optionElement).toHaveClass('correct');
  });
  
  it('should apply incorrect class when selected but not correct', () => {
    render(
      <FlagOption 
        country={mockCountry} 
        onClick={mockOnClick} 
        selectedAnswer="CA"
        correctAnswer="US"
        voiceSelected={false}
      />
    );
    
    const optionElement = screen.getByText('Canada').closest('.flag-option');
    expect(optionElement).toHaveClass('incorrect');
  });
  
  it('should be disabled when an answer is selected', async () => {
    const user = userEvent.setup();
    render(
      <FlagOption 
        country={mockCountry} 
        onClick={mockOnClick} 
        selectedAnswer="US"
        correctAnswer="US"
        voiceSelected={false}
      />
    );
    
    const optionElement = screen.getByText('Canada');
    await user.click(optionElement);
    
    expect(mockOnClick).not.toHaveBeenCalled();
    expect(optionElement).toBeDisabled();
  });
  
  it('should apply voice-selected class when selected by voice', () => {
    render(
      <FlagOption 
        country={mockCountry} 
        onClick={mockOnClick} 
        selectedAnswer={null}
        correctAnswer="US"
        voiceSelected={true}
      />
    );
    
    const optionElement = screen.getByText('Canada').closest('.flag-option');
    expect(optionElement).toHaveClass('voice-selected');
  });
}); 