import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ResumeService } from '../services/resumeService';

export const SecurityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runSecurityTests = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Verify user authentication is required
      addResult('Testing authentication requirement...');
      try {
        await ResumeService.loadResumeData();
        addResult('❌ ERROR: Should not be able to load data without authentication');
      } catch (error: any) {
        if (error.message.includes('not authenticated')) {
          addResult('✅ PASS: Authentication required for data access');
        } else {
          addResult(`❌ ERROR: Unexpected error: ${error.message}`);
        }
      }

      // Test 2: Verify user can only access their own data
      addResult('Testing user data isolation...');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const resumeData = await ResumeService.loadResumeData();
          addResult('✅ PASS: User can access their own data');
          
          // Test 3: Verify RLS policies are working
          addResult('Testing Row Level Security...');
          const { data: allCandidates } = await supabase
            .from('candidates')
            .select('id, user_id');
          
          if (allCandidates && allCandidates.length > 0) {
            const otherUserCandidates = allCandidates.filter(c => c.user_id !== user.id);
            if (otherUserCandidates.length === 0) {
              addResult('✅ PASS: RLS policies working - user only sees their own data');
            } else {
              addResult('❌ ERROR: RLS policies not working - user can see other users data');
            }
          } else {
            addResult('ℹ️ INFO: No other candidates found to test RLS');
          }
        } catch (error: any) {
          addResult(`❌ ERROR: Failed to load user data: ${error.message}`);
        }
      } else {
        addResult('❌ ERROR: No authenticated user found');
      }

    } catch (error: any) {
      addResult(`❌ ERROR: Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Security Test Results</h2>
      
      <button
        onClick={runSecurityTests}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run Security Tests'}
      </button>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click the button above to run security tests.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Security Features Implemented:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Row Level Security (RLS) enabled on all tables</li>
          <li>✅ User-specific policies for data access</li>
          <li>✅ Authentication required for all data operations</li>
          <li>✅ User data isolation via candidate_id foreign keys</li>
          <li>✅ Proper error handling for authentication failures</li>
          <li>✅ Cache clearing on sign out</li>
          <li>✅ Race condition prevention in candidate creation</li>
        </ul>
      </div>
    </div>
  );
};
