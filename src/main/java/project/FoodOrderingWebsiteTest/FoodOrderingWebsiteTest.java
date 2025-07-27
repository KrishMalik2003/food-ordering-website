package com.foodorder;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class FoodOrderingWebsiteTest {
    private WebDriver driver;

    @Before
    public void setUp() {
        System.setProperty("webdriver.chrome.driver", "path/to/chromedriver");
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @Test
    public void testFoodOrderingWebsite() {
        // Open the website
        driver.get("http://localhost:3000");  // Assuming your website is running on localhost:3000

        // Login
        login("tiet1", "test");

        // Add items to cart
        addToCart("Pizza");
        addToCart("Burger");

        // View cart
        driver.findElement(By.id("cart")).click();

        // Verify cart contents
        List<WebElement> cartItems = driver.findElements(By.id("cart-items"));
        assertEquals("Cart should contain 2 items", 2, cartItems.size());

        // Proceed to checkout
        driver.findElement(By.xpath("//button[contains(text(),'Proceed to Payment')]")).click();

        // Fill in payment details
        driver.findElement(By.xpath("//input[@placeholder='Card Number']")).sendKeys("1234567890123456");
        driver.findElement(By.xpath("//input[@placeholder='Expiry Date']")).sendKeys("12/25");
        driver.findElement(By.xpath("//input[@placeholder='CVV']")).sendKeys("123");

        // Complete order
        driver.findElement(By.xpath("//button[contains(text(),'Pay Now')]")).click();

        // Verify order confirmation
        WebElement confirmationMessage = driver.findElement(By.xpath("//p[contains(text(),'Payment successful')]"));
        assertTrue("Order confirmation should be displayed", confirmationMessage.isDisplayed());
    }

    private void login(String username, String password) {
        driver.findElement(By.id("username")).sendKeys(username);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.xpath("//button[contains(text(),'Login')]")).click();
    }

    private void addToCart(String itemName) {
        driver.findElement(By.xpath("//h3[contains(text(),'" + itemName + "')]/following-sibling::button[contains(text(),'Add to Cart')]")).click();
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
