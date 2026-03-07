import pytest
from unittest.mock import MagicMock, patch
import sys
import os

# Add api and worker directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '..', '..', 'api'))
sys.path.append(os.path.join(current_dir, '..'))

import valuation_service

class MockProperty:
    def __init__(self, address, purchase_price=500000.0, initial_loan_value=400000.0):
        self.address = address
        self.address_street = "123 Main St"
        self.address_city = "Anytown"
        self.address_state = "CA"
        self.address_zip = "12345"
        self.purchase_price = purchase_price
        self.initial_loan_value = initial_loan_value

@patch("valuation_service.requests.get")
@patch("valuation_service.RENTCAST_API_KEY", "fake_key")
def test_get_valuation_api_success(mock_get):
    """Tests that API success returns the API value."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"price": 600000}
    mock_get.return_value = mock_response
    
    prop = MockProperty("123 Main St, Anytown, CA")
    val, source = valuation_service.get_valuation(prop)
    
    assert val == 600000
    assert "RentCast API" in source

@patch("valuation_service.requests.get")
@patch("valuation_service.get_scrape_valuation")
@patch("valuation_service.RENTCAST_API_KEY", "fake_key")
def test_get_valuation_api_failure_scrape_success(mock_scrape, mock_get):
    """Tests that API failure falls back to Scraper."""
    mock_get.return_value.status_code = 500
    mock_scrape.return_value = 550000
    
    prop = MockProperty("123 Main St, Anytown, CA")
    val, source = valuation_service.get_valuation(prop)
    
    assert val == 550000
    assert "Web Scrape" in source

@patch("valuation_service.requests.get")
@patch("valuation_service.get_scrape_valuation")
@patch("valuation_service.RENTCAST_API_KEY", "fake_key")
def test_get_valuation_all_failure_manual_fallback(mock_scrape, mock_get):
    """Tests that all failures fall back to manual appreciation."""
    mock_get.return_value.status_code = 500
    mock_scrape.return_value = None
    
    prop = MockProperty("123 Main St, Anytown, CA", purchase_price=500000.0, initial_loan_value=400000.0)
    val, source = valuation_service.get_valuation(prop)
    
    # 400,000 * (1 + 0.02/52) is approx 400153.8
    assert val > 400000
    assert val < 410000
    assert "Manual Appreciation" in source

def test_format_address():
    """Tests address formatting logic."""
    prop = MockProperty("Original Address")
    formatted = valuation_service._format_address(prop)
    assert formatted == "123 Main St, Anytown, CA 12345"
    
    prop.address_street = None
    formatted = valuation_service._format_address(prop)
    assert formatted == "Original Address"

if __name__ == "__main__":
    pytest.main([__file__])
