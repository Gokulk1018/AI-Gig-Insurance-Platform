import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:dio/dio.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late IO.Socket socket;
  bool isRaining = false;
  String currentClaimId = '';
  final dio = Dio();
  bool isTracking = false;

  @override
  void initState() {
    super.initState();
    initSocket();
  }

  void initSocket() {
    // localhost is used instead of 10.0.2.2 so it works natively on Chrome Web
    socket = IO.io('http://localhost:4000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });
    
    socket.connect();
    socket.onConnect((_) {
      print('connected to server!');
      // Assuming demo rider is seeded in HSR Layout
      socket.emit('join_zone', 'BLR_HSR_01'); 
    });

    socket.on('zone_alert', (data) {
      if (mounted) {
        setState(() {
          isRaining = true;
          currentClaimId = data['claimId'] ?? '';
        });
      }
    });
  }

  void simulateShiftStart() async {
    setState(() => isTracking = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ShiftShield', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Chip(
              label: const Text('🌟 100', style: TextStyle(fontWeight: FontWeight.bold)),
              backgroundColor: Colors.grey.shade900,
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildProtectionCard(),
            const SizedBox(height: 30),
            _buildActionButtons(),
            const SizedBox(height: 30),
            if (isRaining) _buildClaimCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildProtectionCard() {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 500),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isRaining 
            ? [Colors.red.shade900, Colors.red.shade700]
            : (isTracking ? [const Color(0xFF10B981), const Color(0xFF047857)] : [Colors.grey.shade800, Colors.grey.shade700]),
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isRaining ? 'PROTECTION ACTIVE' : (isTracking ? 'GUARDING INCOME' : 'OFF SHIFT'),
            style: const TextStyle(fontSize: 12, letterSpacing: 1.5, fontWeight: FontWeight.bold, color: Colors.white70),
          ),
          const SizedBox(height: 10),
          Text(
            isRaining ? 'Heavy Rain Triggered' : (isTracking ? 'HSR Layout • ₹120/hr' : 'Start your shift to protect income'),
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          const Text('Plan Capacity: ₹1,500 / week', style: TextStyle(color: Colors.white70)),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    if (isTracking) return const Center(child: Text("📡 Receiving telemetry...", style: TextStyle(color: Colors.grey)));
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 20),
        backgroundColor: const Color(0xFF3B82F6),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      onPressed: simulateShiftStart,
      child: const Text('Simulate Starting Shift', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildClaimCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.grey.shade900,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.shade400, width: 2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.flash_on, color: Colors.amber),
              const SizedBox(width: 10),
              Text('DRAFT CLAIM: $currentClaimId', style: const TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 10),
          const Text('Status: WAITING FOR STORM TO CLEAR', style: TextStyle(color: Colors.amber)),
          const SizedBox(height: 10),
          const Text('Your estimated payout is calculating in realtime.', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
