@extends('welcome')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-successs" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    {{ __('You are logged in as! SuperAdmin Page') }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
