# LocalMarket Resource Booking and Order Management System
# Simple Python Prototype for SWE5306 Assessment 2
# Student No: HE27436

# Imports the datetime module so the program can generate unique order IDs using the current date and time.
import datetime


# ---------------------------------------------------------
# SAMPLE DATA SECTION
# ---------------------------------------------------------

# This dictionary stores all available products/resources in the LocalMarket system.
# Each product has an ID number, name, seller, price, available booking slots, and stock quantity.
resources = {
    # Product/resource with ID 1.
    1: {
        # Name of the product/resource.
        "name": "Local Bakery Cake Box",

        # Seller or local business providing the product.
        "seller": "Sunny Side Bakery",

        # Price of the product.
        "price": 18.50,

        # Available collection or delivery booking slots.
        "available_slots": ["10:00", "12:00", "15:00"],

        # Number of items currently available.
        "stock": 5
    },

    # Product/resource with ID 2.
    2: {
        "name": "Fresh Vegetable Basket",
        "seller": "Greenfield Produce",
        "price": 12.00,
        "available_slots": ["09:00", "11:00", "14:00"],
        "stock": 8
    },

    # Product/resource with ID 3.
    3: {
        "name": "Handmade Gift Set",
        "seller": "Purely Local Crafts",
        "price": 22.99,
        "available_slots": ["13:00", "16:00"],
        "stock": 3
    },

    # Product/resource with ID 4.
    4: {
        "name": "Wildflower Honey Jar",
        "seller": "Sweet Hills Farm",
        "price": 8.99,
        "available_slots": ["10:30", "13:30", "17:00"],
        "stock": 12
    },

    # Product/resource with ID 5.
    5: {
        "name": "Local Roast Coffee Pack",
        "seller": "Riverbend Coffee",
        "price": 12.49,
        "available_slots": ["09:30", "12:30", "16:30"],
        "stock": 10
    },

    # Product/resource with ID 6.
    6: {
        "name": "Lavender Handmade Soap",
        "seller": "Purely Local",
        "price": 6.50,
        "available_slots": ["11:00", "14:00", "18:00"],
        "stock": 15
    },

    # Product/resource with ID 7.
    7: {
        "name": "Farmhouse Salsa Jar",
        "seller": "Greenfield Goods",
        "price": 5.99,
        "available_slots": ["10:00", "13:00", "15:30"],
        "stock": 9
    },

    # Product/resource with ID 8.
    8: {
        "name": "Flower Bouquet Booking",
        "seller": "Bloom Local Florist",
        "price": 25.00,
        "available_slots": ["09:00", "12:00", "17:30"],
        "stock": 6
    },

    # Product/resource with ID 9.
    9: {
        "name": "Artisan Bread Collection",
        "seller": "Town Corner Bakery",
        "price": 9.75,
        "available_slots": ["08:30", "11:30", "14:30"],
        "stock": 7
    },

    # Product/resource with ID 10.
    10: {
        "name": "Local Cheese Selection",
        "seller": "Countryside Dairy",
        "price": 16.20,
        "available_slots": ["10:00", "12:45", "16:15"],
        "stock": 4
    }
}

# This empty dictionary will store all customer bookings/orders created during the program.
orders = {}


# ---------------------------------------------------------
# FUNCTION SECTION
# ---------------------------------------------------------

# This function displays all available products/resources to the user.
def display_resources():

    # Prints a heading for the product/resource list.
    print("\nAvailable Local Resources / Products")

    # Prints a divider line to make the output easier to read.
    print("-" * 60)

    # Loops through each product/resource in the resources dictionary.
    for resource_id, resource in resources.items():

        # Prints the product/resource ID.
        print(f"ID: {resource_id}")

        # Prints the product/resource name.
        print(f"Name: {resource['name']}")

        # Prints the seller name.
        print(f"Seller: {resource['seller']}")

        # Prints the product/resource price.
        print(f"Price: £{resource['price']}")

        # Prints the current stock level.
        print(f"Stock: {resource['stock']}")

        # Joins all available slots into one readable line and prints them.
        print(f"Available Booking Slots: {', '.join(resource['available_slots'])}")

        # Prints a divider after each product/resource.
        print("-" * 60)


# This function creates a new booking/order for a customer.
def create_booking(customer_name, resource_id, selected_slot):

    # Checks whether the selected resource ID exists in the resources dictionary.
    if resource_id not in resources:

        # Displays an error message if the resource does not exist.
        print("Error: Resource not found.")

        # Stops the function and returns no order ID.
        return None

    # Stores the selected resource details in a variable for easier use.
    resource = resources[resource_id]

    # Checks whether the selected product/resource is out of stock.
    if resource["stock"] <= 0:

        # Displays an error message if no stock is available.
        print("Error: This resource is out of stock.")

        # Stops the function and returns no order ID.
        return None

    # Checks whether the customer selected a valid booking slot.
    if selected_slot not in resource["available_slots"]:

        # Displays an error message if the selected slot is not available.
        print("Error: Selected time slot is not available.")

        # Stops the function and returns no order ID.
        return None

    # Creates a unique order ID using the letters LM and the current date/time.
    order_id = "LM" + datetime.datetime.now().strftime("%Y%m%d%H%M%S")

    # Adds the new order to the orders dictionary using the generated order ID.
    orders[order_id] = {

        # Stores the customer name.
        "customer_name": customer_name,

        # Stores the selected product/resource name.
        "resource_name": resource["name"],

        # Stores the seller name.
        "seller": resource["seller"],

        # Stores the price.
        "price": resource["price"],

        # Stores the selected booking slot.
        "booking_slot": selected_slot,

        # Sets the payment status to Pending at the start.
        "payment_status": "Pending",

        # Sets the first order status.
        "order_status": "Booking Created",

        # Sets the delivery status before dispatch.
        "delivery_status": "Not Dispatched"
    }

    # Reduces the stock quantity by 1 because one item has been booked/ordered.
    resource["stock"] -= 1

    # Confirms that the booking/order has been created.
    print("\nBooking created successfully.")

    # Displays the generated order ID to the user.
    print(f"Order ID: {order_id}")

    # Returns the order ID so it can be used later for payment or tracking.
    return order_id


# This function simulates payment processing for an order.
def process_payment(order_id):

    # Checks whether the entered order ID exists.
    if order_id not in orders:

        # Displays an error if the order cannot be found.
        print("Error: Order not found.")

        # Stops the function.
        return

    # Changes the payment status from Pending to Paid.
    orders[order_id]["payment_status"] = "Paid"

    # Updates the order status after payment confirmation.
    orders[order_id]["order_status"] = "Payment Confirmed"

    # Displays a payment confirmation message.
    print("\nPayment processed successfully.")

    # Displays the order ID.
    print(f"Order ID: {order_id}")

    # Displays the updated payment status.
    print("Payment Status: Paid")


# This function allows the delivery status to be updated.
def update_delivery_status(order_id, new_status):

    # Checks whether the entered order ID exists.
    if order_id not in orders:

        # Displays an error if the order cannot be found.
        print("Error: Order not found.")

        # Stops the function.
        return

    # Updates the delivery status with the new value entered by the user.
    orders[order_id]["delivery_status"] = new_status

    # Checks whether the delivery has been completed.
    if new_status == "Delivered":

        # If delivered, the order is marked as completed.
        orders[order_id]["order_status"] = "Completed"

    # If the delivery is not completed yet, the order remains in progress.
    else:

        # Updates the order status to In Progress.
        orders[order_id]["order_status"] = "In Progress"

    # Confirms that the delivery status has been updated.
    print("\nDelivery status updated.")

    # Displays the order ID.
    print(f"Order ID: {order_id}")

    # Displays the new delivery status.
    print(f"New Delivery Status: {new_status}")


# This function displays tracking information for a specific order.
def track_order(order_id):

    # Checks whether the entered order ID exists.
    if order_id not in orders:

        # Displays an error if the order cannot be found.
        print("Error: Order not found.")

        # Stops the function.
        return

    # Stores the selected order details in a variable.
    order = orders[order_id]

    # Prints a heading for tracking details.
    print("\nOrder Tracking Details")

    # Prints a divider line.
    print("-" * 60)

    # Displays the order ID.
    print(f"Order ID: {order_id}")

    # Displays the customer name.
    print(f"Customer: {order['customer_name']}")

    # Displays the product/resource name.
    print(f"Resource/Product: {order['resource_name']}")

    # Displays the seller name.
    print(f"Seller: {order['seller']}")

    # Displays the booking slot.
    print(f"Booking Slot: {order['booking_slot']}")

    # Displays the price.
    print(f"Price: £{order['price']}")

    # Displays the payment status.
    print(f"Payment Status: {order['payment_status']}")

    # Displays the current order status.
    print(f"Order Status: {order['order_status']}")

    # Displays the delivery status.
    print(f"Delivery Status: {order['delivery_status']}")

    # Prints a divider line.
    print("-" * 60)


# This function displays a simple seller dashboard summary.
def seller_dashboard():

    # Prints the seller dashboard heading.
    print("\nSeller Dashboard Summary")

    # Prints a divider line.
    print("-" * 60)

    # Counts the total number of orders stored in the orders dictionary.
    total_orders = len(orders)

    # Calculates total sales from orders where payment status is Paid.
    total_sales = sum(order["price"] for order in orders.values() if order["payment_status"] == "Paid")

    # Displays the total number of orders.
    print(f"Total Orders: {total_orders}")

    # Displays the total paid sales amount.
    print(f"Total Sales: £{total_sales:.2f}")

    # Prints a heading for stock levels.
    print("\nCurrent Stock Levels:")

    # Loops through all products/resources.
    for resource_id, resource in resources.items():

        # Prints each product/resource name and current stock level.
        print(f"{resource['name']} - Stock: {resource['stock']}")

    # Prints a divider line.
    print("-" * 60)


# ---------------------------------------------------------
# MENU SECTION
# ---------------------------------------------------------

# This function creates the interactive menu for the prototype.
def main_menu():

    # Starts an infinite loop so the menu keeps showing until the user exits.
    while True:

        # Prints the system title.
        print("\nLocalMarket System Prototype")

        # Prints option 1.
        print("1. View available resources/products")

        # Prints option 2.
        print("2. Create booking/order")

        # Prints option 3.
        print("3. Process payment")

        # Prints option 4.
        print("4. Update delivery status")

        # Prints option 5.
        print("5. Track order")

        # Prints option 6.
        print("6. View seller dashboard")

        # Prints option 7.
        print("7. Exit")

        # Asks the user to choose a menu option.
        choice = input("Enter your choice: ")

        # Runs this block if the user chooses option 1.
        if choice == "1":

            # Calls the function that displays all available resources/products.
            display_resources()

        # Runs this block if the user chooses option 2.
        elif choice == "2":

            # Asks the customer to enter their name.
            customer_name = input("Enter customer name: ")

            # Displays all products/resources before booking.
            display_resources()

            # Starts error handling in case the user enters invalid data.
            try:

                # Asks the user to enter the product/resource ID and converts it to an integer.
                resource_id = int(input("Enter resource/product ID: "))

                # Asks the user to enter a booking slot.
                selected_slot = input("Enter booking slot: ")

                # Calls the create_booking function using the entered details.
                create_booking(customer_name, resource_id, selected_slot)

            # Handles the error if the user enters text instead of a number for resource ID.
            except ValueError:

                # Displays an error message.
                print("Invalid input. Resource ID must be a number.")

        # Runs this block if the user chooses option 3.
        elif choice == "3":

            # Asks the user to enter the order ID.
            order_id = input("Enter order ID: ")

            # Calls the payment function for that order.
            process_payment(order_id)

        # Runs this block if the user chooses option 4.
        elif choice == "4":

            # Asks the user to enter the order ID.
            order_id = input("Enter order ID: ")

            # Shows example delivery statuses.
            print("Example statuses: Courier Assigned, Out for Delivery, Delivered")

            # Asks the user to enter the new delivery status.
            new_status = input("Enter new delivery status: ")

            # Calls the delivery update function.
            update_delivery_status(order_id, new_status)

        # Runs this block if the user chooses option 5.
        elif choice == "5":

            # Asks the user to enter the order ID.
            order_id = input("Enter order ID: ")

            # Calls the tracking function.
            track_order(order_id)

        # Runs this block if the user chooses option 6.
        elif choice == "6":

            # Calls the seller dashboard function.
            seller_dashboard()

        # Runs this block if the user chooses option 7.
        elif choice == "7":

            # Displays an exit message.
            print("Exiting LocalMarket prototype.")

            # Breaks the loop and ends the program.
            break

        # Runs this block if the user enters an invalid menu option.
        else:

            # Displays an invalid choice message.
            print("Invalid choice. Please try again.")


# ---------------------------------------------------------
# PROGRAM START
# ---------------------------------------------------------

# This line starts the program by calling the main menu function.
main_menu()