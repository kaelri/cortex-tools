Vue.component('characterSheet', {

	props: {
		character: Object,
		selected:  Array,
		viewY:     Number,
	},

	computed: {

		name() {
			return this.character?.name ?? '';
		},

		description() {
			return this.character?.description ?? '';
		},

		portrait() {
			return this.character?.portrait ?? null;
		},

		traitSets() {
			return this.character?.traitSets ?? [];
		},

		distinctions() {
			return this.traitSets.find( traitSet => traitSet.style === 'distinctions' );
		},

		attributes() {
			return this.traitSets.find( traitSet => traitSet.location === 'attributes' )?.traits || [];
		},

		attributesID() {
			return this.traitSets.findIndex( traitSet => traitSet.location === 'attributes' );
		}

	},

	/*html*/
	template: `<section class="character-sheet" @click.stop="clearSelected">
	
		<div class="pages">

			<!-- PAGE -->
			<div class="page">
				<div class="page-inner">

					<header class="page-header">

						<div :class="{'page-header-inner': true, 'selected': isSelected(['name'])}"
							@click.stop="select([ 'name' ])"
						>
							<div>

								<!-- CHARACTER NAME -->
								<div class="title-container">

									<div class="title"
										v-html="name"
									></div>

									<div class="title-decoration">
										<svg height="4" width="100%"><line x1="0" y1="0" x2="10000" y2="0" style="stroke:#C50852;stroke-width:4pt"/></svg>
									</div>

								</div>

								<!-- CHARACTER DESCRIPTION -->
								<div class="subtitle">
									<span v-html="renderText(description)"></span>
								</div>

							</div>
						</div>

						<name-editor
							:character="character"
							:open="isSelected(['name'])"
							@select="select"
							@update="update"
						></name-editor>

					</header>

					<!-- COLUMNS -->
					<div class="columns">

						<div v-for="pageLocation in ['left', 'right']" :class="'column-' + pageLocation">

							<!-- IMAGE -->
							<div class="portrait" v-if="pageLocation === 'right'">

								<div :class="{ 'portrait-inner': true, 'selected': isSelected(['portrait']) }"
									@click.stop="select([ 'portrait' ])"
								>
									<div class="portrait-circle" width="100%" height="100%" :style="'background-image: url(' + portrait.url + ');'"></div>
								</div>

								<portrait-editor
									:character="character"
									:open="isSelected(['portrait'])"
									@select="select"
									@update="update"
								></portrait-editor>
	
							</div>

							<!-- ATTRIBUTES -->
							<div :class="{ 'attributes': true, 'vertical': attributes.length > 5 }" v-if="pageLocation === 'right'">

								<div class="attributes-grid">

									<div class="attribute-curve" xmlns="http://www.w3.org/2000/svg"
										:style="'display: ' + ( attributes.length >= 2 ? 'block' : 'none' ) + ';'"
										v-if="pageLocation === 'right'"
									>
										<svg viewBox="0 0 62 62" width="62mm" height="30mm" preserveAspectRatio="xMidYMid slice">
											<path d="M -17 -25 A 32 32 0 0 0 79 0" stroke="#C50852" stroke-width="0.5mm" fill="transparent" vector-effect="non-scaling-stroke"/>
										</svg>

									</div>

									<div class="attributes-items"
										v-if="pageLocation === 'right'"
									>
										<div v-for="( attribute, a ) in attributes"
											class="attribute"
											:style="getAttributeStyle( a )"
										>

											<div class="attribute-inner"
												:class="{ 'attribute-inner': true, 'selected': isSelected(['trait', attributesID, a]) }"
												@click.stop="select([ 'trait', attributesID, a ])"
											>

												<span class="c"
													v-html="renderDieValue(attribute.value)"
												></span>

												<div class="attribute-name"
													v-html="attribute.name"
												></div>

											</div>

											<trait-editor
												:character="character"
												:open="isSelected(['trait', attributesID, a])"
												:traitSetID="attributesID"
												:traitID="a"
												:viewY="viewY"
												@select="select"
												@update="update"
												@removeTrait="removeTrait"
											></trait-editor>

										</div>

									</div>

								</div>

								<!-- BUTTON: ADD ATTRIBUTE -->
								<div class="preview-button-container"
									v-if="pageLocation === 'right'"
								>
									<div class="preview-button"
										@click.stop="addTrait( attributesID )"
									>
										<span><i class="fas fa-plus"></i> New Attribute</span>
									</div>
								</div>

							</div>
								
							<!-- TRAITS -->
							<div :class="'trait-set style-' + traitSet.style"
								v-for="(traitSet, s) in traitSets"
								v-if="traitSet.location === pageLocation"
							>

								<div class="trait-set-header">
									<div :class="{'trait-set-header-inner': true, 'selected': isSelected(['traitSet', s])}"
										@click.stop="select([ 'traitSet', s ])"
									>

										<div v-html="traitSet.name"></div>

									</div>

									<trait-set-editor
										:character="character"
										:open="isSelected(['traitSet', s])"
										:traitSetID="s"
										:viewY="viewY"
										@select="select"
										@update="update"
										@removeTraitSet="removeTraitSet"
									></trait-set-editor>

								</div>

								<div class="trait-columns">
									<div class="trait-column" v-for="traitSetLocation in ['left', 'right']">

										<div class="trait"
											v-for="(trait, t) in traitSet.traits"
											v-if="trait.location === traitSetLocation"
										>
											<div :class="{ 'trait-inner': true, 'selected': isSelected(['trait', s, t]) }"
												@click.stop="select([ 'trait', s, t ])"
											>

												<h2 class="trait-title">

													<span class="trait-name"
														v-html="trait.name"
													></span>
												
													<span class="trait-value c"
														v-html="renderDieValue(trait.value)"
													></span>

												</h2>

												<hr>

												<div
													class="trait-description"
													v-html="renderText(trait.description)"
												></div>

												<ul class="trait-sfx" v-if="trait.sfx && trait.sfx.length">
													<li v-for="(sfx, s) in trait.sfx">

														<span class="trait-sfx-name"
															v-html="sfx.name"
														></span>:

														<span class="trait-sfx-description"
															v-html="renderText(sfx.description)"
														></span>

													</li>
												</ul>

											</div>

											<trait-editor
												:character="character"
												:open="isSelected(['trait', s, t])"
												:traitSetID="s"
												:traitID="t"
												:viewY="viewY"
												@select="select"
												@update="update"
												@removeTrait="removeTrait"
											></trait-editor>

										</div>

										<!-- BUTTON: ADD TRAIT -->
										<div class="preview-button-container">
											<div class="preview-button"
												@click.stop="addTrait( s, traitSetLocation )"
											>
												<span><i class="fas fa-plus"></i> New Trait</span>
											</div>
										</div>

									</div> <!-- .trait-column -->
								</div> <!-- .trait-columns -->

							</div>

							<!-- BUTTON: ADD TRAIT SET -->
							<div class="preview-button-container">
								<div class="trait-set-placeholder preview-button"
									@click.stop="addTraitSet( pageLocation )"
								>
									<span><i class="fas fa-plus"></i> New Trait Set</span>
								</div>
							</div>
							
						</div>

					</div> <!-- .columns -->
				</div> <!-- .page-inner -->
			</div> <!-- .page -->
		</div> <!-- .pages -->
	</section>`,

	methods: {

		// PRESENTATION

		isSelected( selector ) {
			return cortexFunctions.arraysMatch( this.selected, selector );
		},

		renderText( text ) {
			text = text.replace( /d\d*(\d)/g, '<span class="c">$1</span>' );
			// text = text.replace( '<span class="c">1(\d)</span>', '<span class="c">$1</span>' );
			text = text.replace( /([^A-Za-z])PP([^A-Za-z])/gi, '$1<span class="pp">PP</span>$2' );
			text = text.replace( "\n", '<br>' );
			return text;
		},

		renderDieValue( value ) {
			return cortexFunctions.getDieDisplayValue( value );
		},


		getAttributeStyle( a ) {

			let top    = 7;
			let left   = 8;
			let right  = left + 61;
			let height = 10;

			let alpha;

			if ( this.attributes.length === 1 ) {
				alpha = .5;
			} else {
				alpha = a / ( this.attributes.length - 1 );
			}

			let x = (right - left) * alpha + left + 3.5;
			let y = Math.sin(alpha * Math.PI) * height + top - 3;
			
			return `left: ${x}mm; top: ${y}mm;`;

		},
		
		// SELECTING

		select( selector ) {
			this.$emit( 'select', selector );
		},

		clearSelected() {
			this.$emit('select', []);
		},

		// EDITING

		addTraitSet( location ) {

			let character = structuredClone( this.character );

			character.traitSets.push({
				name: 'New trait set',
				description: 'Trait set description',
				style: 'default',
				location: location ?? 'left',
				traits: [
					{
						name: 'New trait',
						value: 6,
						description: 'Trait description',
						location: 'left',
						sfx: [],
					}
				],
			});

			this.update( character );

			let newTraitSetID = character.traitSets.length - 1;
			this.select([ 'traitSet', newTraitSetID ]);

		},

		removeTraitSet( traitSetID ) {

			// if ( this.isSelected(['traitSet', traitSetID]) ) {
				this.clearSelected();
			// }

			let character = structuredClone( this.character );

			character.traitSets.splice(traitSetID, 1);

			this.update( character );

		},
		
		addTrait( traitSetID, location ) {

			let character = structuredClone( this.character );

			character.traitSets[traitSetID].traits.push({
				name: 'New trait',
				value: 6,
				description: 'Trait description',
				location: location ?? 'left',
				sfx: [],
			});

			this.update( character );
			
			let newTraitID = character.traitSets[traitSetID].traits.length - 1;
			this.select([ 'trait', traitSetID, newTraitID ]);

		},

		removeTrait( traitSetID, traitID ) {

			/*// If we’re removing the trait that is currently selected, switch to the previous trait, or the parent trait set if no other traits remain.
			if ( this.isSelected(['trait', traitSetID, traitID]) ) {
				if ( this.character.traitSets[traitSetID].traits.length > 1) {
					this.select([ 'trait', traitSetID, traitID - 1 ]);
				} else {
					this.select( 'traitSet', traitSetID );
				}
			} else {*/
				this.clearSelected();
			/*}*/

			let character = structuredClone( this.character );

			character.traitSets[traitSetID].traits.splice(traitID, 1);

			this.update( character );

		},

		update( character ) {
			this.$emit( 'update', character );
		}

	}

});
