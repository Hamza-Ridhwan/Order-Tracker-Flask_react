from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from datetime import datetime
from typing import Dict, Any, List, Optional
from .models import User, Order, Shipment, db

main = Blueprint('main', __name__)

# Helper function to serialize orders
def serialize_order(order: Order) -> Dict[str, Any]:
    return {
        'order_id': order.order_id,
        'product': order.product,
        'quantity': order.quantity,
        'status': order.status,
        'created_at': order.created_at.isoformat(),
        'shipment': {
            'tracking_number': order.shipment[0].tracking_number if order.shipment else None,
            'shipped_date': order.shipment[0].shipped_date.isoformat() if order.shipment and order.shipment[0].shipped_date else None,
            'delivery_date': order.shipment[0].delivery_date.isoformat() if order.shipment and order.shipment[0].delivery_date else None,
        }
    }

# User Registration
@main.route('/register', methods=['POST'])
def register() -> Dict[str, Any]:
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# User Login
@main.route('/login', methods=['POST'])
def login() -> Dict[str, Any]:
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.user_id)
    return jsonify({'access_token': access_token}), 200

# Place Order
@main.route('/orders', methods=['POST'])
@jwt_required()
def place_order() -> Dict[str, Any]:
    user_id = get_jwt_identity()
    data = request.get_json()
    product = data.get('product')
    quantity = data.get('quantity')

    if not product or not quantity:
        return jsonify({'message': 'Product and quantity are required'}), 400

    new_order = Order(user_id=user_id, product=product, quantity=quantity)
    db.session.add(new_order)
    db.session.commit()

    return jsonify({'message': 'Order placed successfully', 'order_id': new_order.order_id}), 201

# Track Order
@main.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def track_order(order_id: int) -> Dict[str, Any]:
    user_id = get_jwt_identity()
    order = Order.query.filter_by(order_id=order_id, user_id=user_id).first()

    if not order:
        return jsonify({'message': 'Order not found'}), 404

    return jsonify(serialize_order(order)), 200

# View Order History
@main.route('/orders', methods=['GET'])
@jwt_required()
def view_order_history() -> Dict[str, Any]:
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).all()

    orders_list = [serialize_order(order) for order in orders]
    return jsonify(orders_list), 200

# Cancel Order
@main.route('/orders/<int:order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id: int) -> Dict[str, Any]:
    user_id = get_jwt_identity()
    order = Order.query.filter_by(order_id=order_id, user_id=user_id).first()

    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if order.status != 'pending':
        return jsonify({'message': 'Order cannot be canceled'}), 400

    order.status = 'canceled'
    db.session.commit()

    return jsonify({'message': 'Order canceled successfully'}), 200

# Edit Order
@main.route('/orders/<int:order_id>/edit', methods=['PUT'])
@jwt_required()
def edit_order(order_id: int) -> Dict[str, Any]:
    user_id = get_jwt_identity()
    order = Order.query.filter_by(order_id=order_id, user_id=user_id).first()

    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if order.status != 'pending':
        return jsonify({'message': 'Order cannot be edited'}), 400

    data = request.get_json()
    order.product = data.get('product', order.product)
    order.quantity = data.get('quantity', order.quantity)
    db.session.commit()

    return jsonify({'message': 'Order updated successfully'}), 200

# Rate Order
@main.route('/orders/<int:order_id>/rate', methods=['POST'])
@jwt_required()
def rate_order(order_id: int) -> Dict[str, Any]:
    user_id = get_jwt_identity()
    order = Order.query.filter_by(order_id=order_id, user_id=user_id).first()

    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if order.status != 'delivered':
        return jsonify({'message': 'Order cannot be rated'}), 400

    data = request.get_json()
    rating = data.get('rating')

    # Add rating logic here (e.g., store in a new Rating model)
    return jsonify({'message': 'Order rated successfully'}), 200

# Change Password
@main.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password() -> Dict[str, Any]:
    user_id = get_jwt_identity()
    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password:
        return jsonify({'message': 'New password is required'}), 400

    user = User.query.get(user_id)
    user.password = new_password
    db.session.commit()

    return jsonify({'message': 'Password changed successfully'}), 200